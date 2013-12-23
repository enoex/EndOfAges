// ===========================================================================
//
// Battle - Ability List subview
//      View for an ability list
//
//  Shows the available abilities for an entity
//
// ===========================================================================
define(
    [ 
        'd3', 'backbone', 'marionette', 'logger', 'events',
        'views/subviews/battle/AbilityItem'
    ], function viewBattleAbility(
        d3, backbone, marionette, logger, events,
        AbilityItem
    ){

    var AbilityList = Backbone.Marionette.CollectionView.extend({
        itemView: AbilityItem,
        'className': 'ability-list-wrapper',

        itemViewOptions: function(model){
            return {index: this.collection.indexOf(model)};
        },

        initialize: function battleViewInitialize(options){
            var self = this;
            logger.log('views/subviews/battle/AbilityList', 
            'initialize() called');

            // keep track of what entity this ability list is for
            this.entityModel = options.entityModel;

            // if an entity died when this view is rendered, update the template
            this.listenTo(this.entityModel, 'entity:died', this.entityDied);

            // keep track of the active (usable) abilities (abilities that are 
            // usable, the timer has past the castTime)
            this.activeAbilities = {};
            _.each(this.collection.models, function(model){
                self.activeAbilities[model.cid] = false; 
            });

            return this;
        },

        onShow: function(){
            if(!this.entityModel.get('isAlive')){
                this.$el.append('<div class="entity-dead"></div>');
            }

            return this;
        },

        // ------------------------------
        // Game events
        // ------------------------------
        checkTimer: function checkTimer(time){
            // called on each loop iteration. Check the abilities 
            // and triggers a change event if necessary
            var self = this;

            _.each(this.collection.models, function(ability){
                // see if ability is usable. if so, trigger a change event
                // if necessary (which abilityItem view listens for)

                // if the activeAbilities ability has an inverse equality,
                // change the equality and trigger an event on the ability
                // model
                if(time < ability.attributes.castTime){
                    // CANNOT use
                    //
                    if(self.activeAbilities[ability.cid]){ 
                        console.log("><><><> NOOOOO", time, ability.cid);
                        self.activeAbilities[ability.cid] = false;
                        ability.trigger('abilityInactive');
                    }
                } else {
                    // CAN use
                    if(!self.activeAbilities[ability.cid]){ 
                        self.activeAbilities[ability.cid] = true;
                        ability.trigger('abilityActive');
                    }
                }
            });

            return this;
        },

        entityDied: function entityDied(options){
            // called when an entitiy dies
            logger.log('views/subviews/battle/AbilityList', 
            'entityDied() : bluring abilities');

            this.$el.append('<div class="entity-dead"></div>');

            return this;
        }
    });

    return AbilityList;
});
