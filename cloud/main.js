
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

//faz o registro do usuário pelo email
Parse.Cloud.define("userSignUp", function(request, response) {

var usernameReceived = request.params.username;
var username = usernameReceived.toLowerCase();
var email = request.params.email;
var password = request.params.password;
var image = request.params.image;
var imageTitle = usernameReceived + "P" + ".jpg"
var parseFile = new Parse.File(imageTitle, image);
var randomNumber = request.params.randomNumber //numero aleatório utilizado para checar se o comando post é repetido

 var queryCheckRepeatedPost = new Parse.Query(Parse.User);

    queryCheckRepeatedPost.equalTo("ramdomNumber", randomNumber); //verifica se o comando post é repetido
    queryCheckRepeatedPost.first({
      useMasterKey: true,
        success: function(repeatedPost) { //resultado do comando post duplo

            if (repeatedPost == undefined) { //nenhum usuário retornou da query, prosseguir novo usuário

                 var user = new Parse.User();

                 user.set("username", username);
                 user.set("email", email);
                 user.set("password", password);
                 user.set("profileImage", parseFile);
                 user.set("createdViaFacebook", false);
                 user.set("blockedUser", false);
                 user.set("randomNumber", randomNumber);
                 user.signUp(null, {
                   useMasterKey: true,
                      success: function(resultsUser) { //usuário criado

                          var SaveObject = Parse.Object.extend("Follow");
                          var saveObject = new SaveObject();

                          saveObject.set("userId", resultsUser);
                          saveObject.save(null, {  
                            useMasterKey: true, 
                               success: function(item) { //followObject criado

                                 var SaveObject2 = Parse.Object.extend("NotificationsNumber");
                                 var saveObject2 = new SaveObject2();

                                  saveObject2.set("userId", resultsUser);
                                  saveObject2.set("number", 0);
                                  saveObject2.save(null, {  
                                    useMasterKey: true, 
                                      success: function(item1) { //objeto de notificação criado

                                           var SaveObject3 = Parse.Object.extend("BlockedUser");
                                           var saveObject3 = new SaveObject3();

                                            saveObject3.set("userId", resultsUser);
                                            saveObject3.save(null, {  
                                              useMasterKey: true, 
                                                success: function(blockedObject) { //objeto de bloqueio criado

                                                response.success(resultsUser);
                                                },

                                                error: function() {
                                                   response.error(error.message);
                                                }
                                            });
                                      },
                                      error: function() {
                                         response.error(error.message);
                                     }
                                 });

              
                               },
                               error: function() {
                                  response.error(error.message);
                               }
                        });
                    },
                    error: function(user, error) {
    
                       response.error(error.message);
                    }
                  });
            
            }else{

               response.success(repeatedPost); //responde o usuário pois o comando post é repetido

            };
        },
        error: function(user, error) {
            response.error(error.message);
        }
                 
   });

});
