// ===========================================================================
//
// All Ability List
//
// ItemView for class item
//
// ===========================================================================
define(
    [ 
        'd3', 'logger', 'events'
    ], function viewAllAbilityListItem(
        d3, logger, events
    ){

    var AllAbilityListItem = Backbone.Marionette.ItemView.extend({
        'className': 'list-item',
        template: '#template-create-all-abilities-list-item',

        events: {
            'click': 'abilityClicked'
        },


        serializeData: function(){
            return _.extend({ 
                cid: this.model.cid,
                sprite: this.model.attributes.sprite || null,
                disabled: false
            }, this.model.toJSON());
        },

        initialize: function(){
            logger.log('AllAbilitiesListItem', 'initialize : model %O',
                this.model);
            return this;
        },

        onShow: function(){
            var self = this;

            var sprite = this.model.get('effectId');
            this.$el.attr({
                id: 'create-all-ability-' + 
                    this.model.attributes.id
            });

            if(this.model.attributes.disabled){
                this.$el.addClass('disabled');
            }

            setTimeout(function(){requestAnimationFrame(function(){
                self._delegateDOMEvents();
            });}, 20);

            return this;
        },

        abilityClicked : function abilityClicked(){
            logger.log('AllAbilitiesListItem', 'ability item clicked'); 

            events.trigger('create:page4:abilityClicked', { 
                $el: this.$el,
                model: this.model
            });

            return this;
        }

    });

    return AllAbilityListItem;
});