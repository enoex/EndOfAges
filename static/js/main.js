//========================================
//Require Config (load additional libraries)
//========================================
requirejs.config({
    baseUrl: '/static/js',
    //For dev
    urlArgs: 'v='+(new Date()).getTime(),

    paths: {
        'jquery-ui': 'lib/jquery.ui',

        d3: 'lib/d3',
        async: 'lib/async.min',
    
        // We're using lodash in place of underscore
        lodash: 'lib/lodash.min',
        
        jwerty: 'lib/jwerty.min',

        backbone: 'lib/backbone',
        localstorage: 'lib/backbone.localstorage',
        marionette: 'lib/marionette',
        bootstrap: 'lib/bootstrap',
    },
    shim: {
        'jquery-ui': {
            deps: ['jquery'], 
            exports: '$'
        },
        'd3': {
            exports: 'd3'
        },
        'lodash': {
            exports: '_'
        },

        'jwerty': {
            exports: 'jwerty'
        },

        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['lodash'], 
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        'async': {
            exports: 'async'
        },
        'marionette' : {
            deps : ['backbone'],
            exports : 'Marionette'
        },
        'logger': {
            exports: 'logger'
        },
        'bootstrap': {
            exports: 'jquery',
            deps: ['jquery'] 
        }
    }
});

//========================================
// Set everything up
//========================================
require([
    //libs
    'jquery', 'lib/jquery.transit.min', 'lib/jquery.visibility',
    'backbone', 'marionette', 'bootstrap',
    'util/d3plugins', // always load d3 plugins, extends d3 object

    //utils
    'logger', 
    'util/browserInfo',
    'util/Timer',
    'handleKeys',

    //app
    'app', 
    'events',

    'Controller',
    'appRouter'
    ],
    function main(
        $, $transit, $visibility,
        Backbone, marionette, bootstrap,
        d3plugins,

        logger, 
        browserInfo,
        Timer,
        handleKeys,

        app, events,

        Controller,
        getAppRouter
    ){

    // Allows multiple modals 
    if (!$.support.transition) { $.fn.transition = $.fn.animate; }

    //For IE8, don't cache AJAX queries. 
    if(browserInfo.isIe8){ $.ajaxSetup({ cache: false }); }

    //INITIAL CONFIG
    //-----------------------------------
    //Configure log options (set app-wide) 
    
    ////NO logging:
    //logger.options.logLevel = false;
    
    //// log errors:
    logger.options.logLevel = [ 
        // should always include these
        // ------------------------------
        'error',
        ,'warn'
        //,'views/subviews/Battle'
        ,'views/subviews/battle/EntityInfoCollection'
        //,'views/DevTools'

        //,'app'

        //,'views/subviews/Battle'

        // optional / for dev
        // ------------------------------
        //,'Controller'
        //,'views/subviews/Battle'
        //,'views/subviews/Map'
        //,'models/Map'
        //,'models/Entity'
        //,'models/Ability'
    ];

    //// log EVERYTHING:
    //logger.options.logLevel = true;

    //-----------------------------------
    //APP Config - Add router / controller
    //-----------------------------------
    app.addInitializer(function(options){
        // get the app controller, pass in all the regions
        var appController = new Controller({
            //pass in regions to the controller, which allows updating
            //  specific parts of the DOM
            regions: app._regionManager._regions
        });

        // There's only ever ONE app-wide router (handles URL page routing) 
        router = getAppRouter({ controller: appController });
        app.router = router;


        // When event it triggered to change page, catch it
        events.on('app:router:navigate', function(route){
            logger.log('events', 
                'app:router:navigate event received, changing page to:',
                route
            );

            app.router.navigate(route, true);
        });

        // ------------------------------
        // Events for window losing or gaining focus / visibility 
        // ------------------------------
        $(document).on({
            'show.visibility': function(e) {
                logger.log('app', 'document:show event triggering at : ' + 
                    new Date() + ' %O', e);
                events.trigger('document:show');
            },
            'hide.visibility': function(e) {
                logger.log('app', 'document:hide event triggering at : ' + 
                    new Date() + ' %O', e);
                events.trigger('document:hide');
            }
        });

        // ------------------------------
        // setup handle keys
        // ------------------------------
        handleKeys();

    });

    app.start();
});
