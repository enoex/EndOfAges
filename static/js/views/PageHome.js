// ===========================================================================
//
// PageTitleScreen
// 
// ===========================================================================
define(
    [ 
        'd3', 'backbone', 'marionette',
        'logger', 'events',
        'models/Entity',
        'views/create/RaceList',
        'collections/Races'
    ], function viewPageHome(
        d3, backbone, marionette, 
        logger, events,
        Entity,
        RaceList,
        Races
    ){

    // CONFIG
    // ----------------------------------
    var baseDelay = 1000;
    var baseDelay = 10;

    // View 
    // ----------------------------------
    var PageHome = Backbone.Marionette.Layout.extend({
        template: '#template-page-home',
        'className': 'page-home-wrapper',

        'regions': {
            'regionRaceList': '#region-create-races'
        },

        events: {
        },

        initialize: function initialize(options){
            // initialize:
            logger.log('views/PageHome', 'initialize() called');

            // Create a new entity model for character create
            this.model = new Entity({});

            // Setup races and collection
            this.races = new Races();
            this.raceListView = new RaceList({
                collection: this.races
            });

            // When race is clicked, continue on to the next step
            this.listenTo(events, 'create:page2:raceClicked', this.raceClicked);

            return this;
        },

        onShow: function homeOnShow(){
            // When the view is rendered, set everything up
            
            var self = this;
            logger.log('views/PageHome', 'onShow called');

            // setup races
            this.regionRaceList.show(this.raceListView);

            // keep reference to pages
            this.$pages = $('#book-pages', this.$el);

            // remove 'hidden' pages
            $('.hidden', this.$pages).removeClass('hidden');

            // Setup pageturn
            this.setupPageturn();

            // Setup title page stuff
            this.setupPage1();

            return this;
        },

        // ------------------------------
        // Pageturn util
        // ------------------------------
        setupPageturn: function setupPageturn(){
            // Initializes the pageTurn animation library
            //
            var self = this;
            var curPage = 1;
            self.$pages.turn({
                display: 'double',
                acceleration: true,
                page: 2,
                gradients: !$.isTouch,
                duration: 1300,
                elevation: 250,
                when: {
                    turned: function(e, page) {
                        //// Do effect on turn
                        // log : $(this).turn('view'));
                    }
                }
            });
            
            $(window).bind('keydown', function(e){
                // Don't let pages go below 2 (we don't have a cover page) and
                // don't let it go above the number of pages we have
                if (e.keyCode==37) {
                    if(curPage > 1){
                        e.preventDefault();
                        self.$pages.turn('previous');
                        curPage--;
                    }
                } else if (e.keyCode==39) {
                    if(curPage < 2){
                        e.preventDefault();
                        curPage++;
                        self.$pages.turn('next');
                    }
                }
            });
        },

        // ==============================
        //
        // Page 1  - Title
        // 
        // ==============================
        setupPage1: function setupStep1(){
            // Sets up flow for the title page
            //
            // TODO: Think of best on board flow. Fade in word by word?
            // TODO: When mouse over bottom left, should the name text
            // fade in automatically instead of waiting for the user to read
            // the text?
            logger.log('views/PageHome', 'setupPage1() called');

            var self = this;
            var $p = $('#book-page-title p', this.$el);
            var animation = 'fadeInDown';
            var $name = $('#create-name', this.$el);
            var enteredText = false;

            $($p[0]).velocity({ opacity: 1 });
            $($p[0]).addClass('animated ' + animation);

            setTimeout(function (){

                $($p[1]).velocity({ opacity: 1 });
                $($p[1]).addClass('animated fadeInUp');

                setTimeout(function (){

                    $name.velocity({ opacity: 1 });

                    setTimeout(function(){
                        if(!enteredText){
                            $name.addClass('animated pulse infinite');
                        }
                    }, baseDelay);

                    // Remove the pulsating effect when user clicks input
                    $name.focus(function (){ 
                        enteredText = true;
                        $name.removeClass('pulse infinite'); 

                        setTimeout(function showPage2(){
                            // DONE, Show page 2
                            logger.log('views/PageHome', 
                                '\t setupPage1: calling setupPage2...');
                            self.setupPage2();

                        }, baseDelay);
                    });
                }, baseDelay);

            }, baseDelay * 1.5);
            return this;
        },


        // ==============================
        //
        // Page 2 - Race
        // 
        // ==============================
        setupPage2: function setupPage2 (){
            var self = this;
            logger.log('views/PageHome', 'setupPage2() called');

            var animation = 'fadeInDown';
            $('#race-header').velocity({ opacity: 1 });
            $('#race-header').addClass('animated fadeInDown');


            // then show the seletion
            setTimeout(function(){
                $('#create-race-wrapper').velocity({ opacity: 1 });
                $('#create-race-wrapper').addClass('animated fadeInUp');
            }, baseDelay * 1.2);

            return this;
        },

        // ------------------------------
        // race clicked
        // ------------------------------
        raceClicked: function raceClicked (options){
            logger.log('views/PageHome', 'raceClicked() passed options: %O',
                options);

            return this;
        }
        
    });

    return PageHome;
});
