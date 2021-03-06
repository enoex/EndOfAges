// ===========================================================================
//
// App User
//
//  Model class for the app wide user object 
//
// ===========================================================================
define(
    [ 'events', 'logger', 'util/API_URL' ], function AppUserModel(
        events, logger, API_URL
    ){

        // Define the app user model. Similar to user model, but a bit different
        var AppUser = Backbone.Model.extend({
            defaults: {
                username: null,
                profilePic: null,
                name: '',
                fName: '',
                lName: '',
                facebookId: '',
                personalityHistory: []
            },
        
            url: API_URL + 'user/',

            initialize: function appUserInitialize(){
                var self = this;
                logger.log('models/AppUser', 
                    'User:initialize: New app user created');

                // When model comes back from server, if there's no error
                this.on('sync', function(model, res){
                    if(!res.error && res.username){
                        logger.log('models/AppUser', 
                            'sync: no error, setting properties for model: %O | res: %O',
                            self.cid,
                            res);

                        var newProps = {
                            error: false,
                            isLoggedIn: true
                        };

                        self.set(newProps);
                    }
                });

                // Try to fetch from server immediately. This ALSO immediately
                // tries to fetch friends
                this.fetch({
                    success: function(res){ 
                        // Check if there's an error (e.g., appUser isn't authed)
                        if(res.attributes.error){
                            logger.log('models/AppUser',
                                'fetch(): appUser not logged in');
                            return false;
                        }
                        // no error, remove if there was an exisiting error
                        self.unset('error');
                        self.trigger('initialFetchFromServer');
                        return self;
                    },
                    error: function(){ 
                        logger.error('models/AppUser', 
                            'fetch(): unable to get model from server');
                        return self;
                    }
                });


                return this;
            }

        });

    return AppUser;
});
