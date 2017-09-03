angular.module('TaskMasterPro')

        .controller('GoalController', ['$scope', 'goalFactory', 'AuthFactory', function($scope, goalFactory, AuthFactory) {
          
            $scope.showGoals = false;
            $scope.message = "Loading...";
            $scope.sortType = [{name: "Title A-Z", val: "name"}, 
                               {name: "Title Z-A", val: "-name"}, 
                               {name: "Created Asc", val: "createdate"}, 
                               {name: "Created Desc", val: "-createdate"}, 
                               {name: "Due Asc", val: "date"}, 
                               {name: "Due Desc", val: "-date"}];
            $scope.sortType2 = [{name: "Title A-Z", val: "name"}, 
                                {name: "Title Z-A", val: "-name"}, 
                                {name: "Created Asc", val: "createdate"}, 
                                {name: "Created Desc", val: "-createdate"}, 
                                {name: "Completed Asc", val: "date"}, 
                                {name: "Completed Desc", val: "-date"}, 
                                {name: "Trophies Highest", val: "-award"}, 
                                {name: "Trophies Lowest", val: "award"}];
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch all goals data
            goalFactory.query({userId: $scope.userId},
                function(response){
                    $scope.GoalList = response;
                    $scope.showGoals = true;
                    console.log("Goals data loaded!");
                            },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
        }])

        .controller('GoalFormController', ['$scope', 'goalFactory', 'userFactory', 'AuthFactory', '$location', function($scope, goalFactory, userFactory, AuthFactory, $location) {
            
            $scope.goalEntry = {name:"", notes:"", date:null, points:"", award:"0", createdate:"", active:true, complete:false};
            
            // options for Date Picker
            $scope.dateOptions = {
                startingDay: 1,
                showWeeks: false
            };
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            $scope.submitGoal = function() {
                
                // Add to lifetime goal count and lifetime actions count
                $scope.user.ltgoals = $scope.user.ltgoals + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime goals
                if ($scope.user.ltgoalsTarget < 6) {
                    
                    var goalCheeves = [1, 3, 6, 9, 12, 15];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = goalCheeves[($scope.user.ltgoalsTarget)];
                    
                    if ($scope.user.ltgoals == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltgoalsTarget = $scope.user.ltgoalsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    var actionCheeves = [10, 50, 100, 200, 300];

                    // Determine achievement threshold and check if it's been reached
                    var actTarget = actionCheeves[($scope.user.ltactsTarget)];

                    if ($scope.user.ltacts == actTarget) {

                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltactsTarget = $scope.user.ltactsTarget + 1;

                    }
                
                }
                // Create goal
                $scope.goalEntry.createdate = new Date().toISOString();
                goalFactory.save({userId: $scope.userId}, $scope.goalEntry).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal created and tracking updated!");
                                    $scope.goalForm.$setPristine();
                                    $location.path('/goals');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Create goal failed.");
                        }
                );
                
            };
            
        }])

        .controller('GoalDetailController', ['$scope', '$stateParams', 'goalFactory', 'userFactory', 'AuthFactory', 'ngDialog', '$location', function($scope, $stateParams, goalFactory, userFactory, AuthFactory, ngDialog, $location) {

            $scope.showGoal = false;
            $scope.message = "Loading...";
            
            // options for Date Picker
            $scope.dateOptions = {
                startingDay: 1,
                showWeeks: false
            };
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            // Fetch individual goal data
            $scope.goal = goalFactory.get({userId: $scope.userId, goalId:$stateParams.id}).$promise.then(
                function(response){
                    $scope.goal = response;
                    $scope.showGoal = true;
                    console.log("Details for Goal " + $scope.goal._id + " loaded!");
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
            // Achievement check for lifetime actions (import to other functions to save space)
            $scope.checkActions = function () {
                
                var actionCheeves = [10, 50, 100, 200, 300];

                // Determine achievement threshold and check if it's been reached
                var actTarget = actionCheeves[($scope.user.ltactsTarget)];

                if ($scope.user.ltacts == actTarget) {

                    // If so, add 1 to user achievements and achievement target
                    $scope.user.cheeves = $scope.user.cheeves + 1;
                    $scope.user.ltactsTarget = $scope.user.ltactsTarget + 1;

                }
                
            }; // $scope.checkActions();
            
            $scope.editGoal = function() {
                
                // Add to lifetime edit count and lifetime actions count
                $scope.user.ltedits = $scope.user.ltedits + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Edit goal
                goalFactory.update({userId: $scope.userId, goalId:$scope.goal._id}, $scope.goal).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal updated and tracking updated!");
                                    $scope.goalForm.$setPristine();
                                    $location.path('/goals');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Update goal failed.");
                        }
                );
                
            };
            
            $scope.deleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/goaldelete.html', controller:"GoalDetailController" });
                
            };
            
            $scope.deleteGoal = function() {
                
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete goal
                goalFactory.delete({userId: $scope.userId, goalId:$scope.goal._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/goals');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete goal failed.");
                        }
                );
            
            };
            
            $scope.archiveDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/goalarchive.html', controller:"GoalDetailController" });
                
            };
            
            $scope.arcDeleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/arcgoaldelete.html', controller:"GoalDetailController" });
                
            };
            
            $scope.arcRestoreDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/arcgoalrestore.html', controller:"GoalDetailController" });
                
            };
            
            $scope.archiveGoal = function() {
                
                // Flag goal archived
                $scope.goal.active = false;
                
                // Add to lifetime archive count and lifetime actions count
                $scope.user.ltarcs = $scope.user.ltarcs + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime archives
                if ($scope.user.ltarcsTarget < 5) {
                    
                    var arcCheeves = [1, 5, 10, 15, 20];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = arcCheeves[($scope.user.ltarcsTarget)];
                    
                    if ($scope.user.ltarcs == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltarcsTarget = $scope.user.ltarcsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Archive goal
                goalFactory.update({userId: $scope.userId, goalId:$scope.goal._id}, $scope.goal).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal archived and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/goals');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Archive goal failed.");
                        }
                );
            
            };
            
            $scope.arcDeleteGoal = function() {
                
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete goal
                goalFactory.delete({userId: $scope.userId, goalId:$scope.goal._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/goalsarc');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete goal failed.");
                        }
                );
            
            };
            
            $scope.restoreGoal = function() {
                
                // Flag goal restored
                $scope.goal.active = true;
                
                // Add to lifetime restore count and lifetime actions count
                $scope.user.ltrests = $scope.user.ltrests + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Restore goal
                goalFactory.update({userId: $scope.userId, goalId:$scope.goal._id}, $scope.goal).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal restored and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/goalsarc');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Restore goal failed.");
                        }
                );
            
            };
            
            $scope.completeDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/goalcomplete.html', controller:"GoalDetailController" });
                
            };
            
            $scope.completeGoal = function() {
                
                // Flag goal completed
                $scope.goal.active = false;
                $scope.goal.complete = true;
                // Change Due Date to Completed Date
                $scope.goal.date = new Date().toISOString();
                
                // Add reward points to user total and lifetime total
                $scope.user.rpoints = ($scope.user.rpoints + $scope.goal.points);
                $scope.user.ltrpoints = ($scope.user.ltrpoints + $scope.goal.points);
                // If trophy awarded, add to user total and lifetime trophies
                if ($scope.goal.award != "0") {
                    
                    $scope.user.trophies = $scope.user.trophies + 1;
                    $scope.user.lttrops = $scope.user.lttrops + 1;
                    
                    // Achievement check for lifetime trophies
                    if ($scope.user.lttropsTarget < 5) {

                        var tropCheeves = [1, 2, 4, 6, 8];

                        // Determine achievement threshold and check if it's been reached
                        var tropTarget = tropCheeves[($scope.user.lttropsTarget)];

                        if ($scope.user.lttrops == tropTarget) {

                            // If so, add 1 to user achievements and achievement target
                            $scope.user.cheeves = $scope.user.cheeves + 1;
                            $scope.user.lttropsTarget = $scope.user.lttropsTarget + 1;

                        }

                    }
    
                }
                // Add to lifetime comp count and lifetime actions count
                $scope.user.ltcomps = $scope.user.ltcomps + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime comps
                if ($scope.user.ltcompsTarget < 5) {
                    
                    var compCheeves = [1, 3, 5, 7, 9];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = compCheeves[($scope.user.ltcompsTarget)];
                    
                    if ($scope.user.ltcomps == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltcompsTarget = $scope.user.ltcompsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Complete goal
                goalFactory.update({userId: $scope.userId, goalId:$scope.goal._id}, $scope.goal).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal completed and tracking updated!");
                                    ngDialog.close();
                                    ngDialog.open({ template: 'views/dialogs/congrats.html', controller:"GoalDetailController" });
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Complete goal failed.");
                        }
                );
            
            };
            
            $scope.compDeleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/compgoaldelete.html', controller:"GoalDetailController" });
                
            };
            
            $scope.compCopyDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/compgoalcopy.html', controller:"GoalDetailController" });
                
            };
            
            $scope.compDeleteGoal = function() {
                
                // Check for trophy, if present delete from user total
                if ($scope.goal.award != "0"){
                    $scope.user.trophies = $scope.user.trophies - 1;
                }
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete goal
                goalFactory.delete({userId: $scope.userId, goalId:$scope.goal._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/goalscomp');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete goal failed.");
                        }
                );
            
            };
            
            $scope.compCopyGoal = function() {
                
                $scope.goalCopy = {name:"", notes:"", date:null, points:"", award:"0", createdate:"", active:true, complete:false};
                
                // Copy old goal data to new goal
                $scope.goalCopy.name = $scope.goal.name;
                $scope.goalCopy.notes = $scope.goal.notes;
                $scope.goalCopy.points = $scope.goal.points;
                $scope.goalCopy.award = $scope.goal.award;
                // New create date
                $scope.goalCopy.createdate = new Date().toISOString();
                
                // Add to lifetime copy count and lifetime actions count
                $scope.user.ltcopies = $scope.user.ltcopies + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Create goal
                goalFactory.save({userId: $scope.userId}, $scope.goalCopy).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Goal created and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/goals');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Create goal failed.");
                        }
                );
                
            };
            
        }])

        .controller('TaskController', ['$scope', 'taskFactory', 'AuthFactory', function($scope, taskFactory, AuthFactory) {
          
            $scope.showTasks = false;
            $scope.message = "Loading...";
            $scope.sortType = [{name: "Title A-Z", val: "name"}, 
                               {name: "Title Z-A", val: "-name"}, 
                               {name: "Date Asc", val: "createdate"}, 
                               {name: "Date Desc", val: "-createdate"}];
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch all tasks data
            taskFactory.query({userId: $scope.userId},
                function(response){
                    $scope.TaskList = response;
                    $scope.showTasks = true;
                    console.log("Tasks data loaded!");
                            },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
        }])

        .controller('TaskFormController', ['$scope', 'taskFactory', 'userFactory', 'AuthFactory', '$location', function($scope, taskFactory, userFactory, AuthFactory, $location) {
            
            $scope.taskEntry = {name:"", notes:"", freq:"", points:"", count:0, createdate:"", active:true};
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            $scope.submitTask = function() {
                
                // Add to lifetime task count and lifetime actions count
                $scope.user.lttasks = $scope.user.lttasks + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime tasks
                if ($scope.user.lttasksTarget < 6) {
                    
                    var taskCheeves = [1, 5, 10, 15, 20, 25];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = taskCheeves[($scope.user.lttasksTarget)];
                    
                    if ($scope.user.lttasks == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.lttasksTarget = $scope.user.lttasksTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    var actionCheeves = [10, 50, 100, 200, 300];

                    // Determine achievement threshold and check if it's been reached
                    var actTarget = actionCheeves[($scope.user.ltactsTarget)];

                    if ($scope.user.ltacts == actTarget) {

                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltactsTarget = $scope.user.ltactsTarget + 1;

                    }
                
                }
                
                // Create task
                $scope.taskEntry.createdate = new Date().toISOString();
                taskFactory.save({userId: $scope.userId}, $scope.taskEntry).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task created and tracking updated!");
                                    $scope.taskForm.$setPristine();
                                    $location.path('/tasks');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Create task failed.");
                        }
                );
                
            };
            
        }])

        .controller('TaskDetailController', ['$scope', '$stateParams', 'taskFactory', 'userFactory', 'AuthFactory', 'ngDialog', '$location', '$state', function($scope, $stateParams, taskFactory, userFactory, AuthFactory, ngDialog, $location, $state) {

            $scope.showTask = false;
            $scope.message = "Loading...";
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            // Fetch individual task data
            $scope.task = taskFactory.get({userId: $scope.userId, taskId:$stateParams.id}).$promise.then(
                function(response){
                    $scope.task = response;
                    $scope.showTask = true;
                    console.log("Details for Task " + $scope.task._id + " loaded!");
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
            // Achievement check for lifetime actions (import to other functions to save space)
            $scope.checkActions = function () {
                
                var actionCheeves = [10, 50, 100, 200, 300];

                // Determine achievement threshold and check if it's been reached
                var actTarget = actionCheeves[($scope.user.ltactsTarget)];

                if ($scope.user.ltacts == actTarget) {

                    // If so, add 1 to user achievements and achievement target
                    $scope.user.cheeves = $scope.user.cheeves + 1;
                    $scope.user.ltactsTarget = $scope.user.ltactsTarget + 1;

                }
                
            }; // $scope.checkActions();
            
            $scope.editTask = function() {
                
                // Add to lifetime edit count and lifetime actions count
                $scope.user.ltedits = $scope.user.ltedits + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Edit task
                taskFactory.update({userId: $scope.userId, taskId:$scope.task._id}, $scope.task).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task edited and tracking updated!");
                                    $scope.taskForm.$setPristine();
                                    $location.path('/tasks');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Edit task failed.");
                        }
                );
                
            };
            
            $scope.deleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/taskdelete.html', controller:"TaskDetailController" });
                
            };
            
            $scope.deleteTask = function() {
                
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete task
                taskFactory.delete({userId: $scope.userId, taskId:$scope.task._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/tasks');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete task failed.");
                        }
                );
            
            };
            
            $scope.archiveDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/taskarchive.html', controller:"TaskDetailController" });
                
            };
            
            $scope.arcDeleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/arctaskdelete.html', controller:"TaskDetailController" });
                
            };
            
            $scope.arcRestoreDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/arctaskrestore.html', controller:"TaskDetailController" });
                
            };
            
            $scope.archiveTask = function() {
                
                // Flag task archived
                $scope.task.active = false;
                
                // Add to lifetime archive count and lifetime actions count
                $scope.user.ltarcs = $scope.user.ltarcs + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime archives
                if ($scope.user.ltarcsTarget < 5) {
                    
                    var arcCheeves = [1, 5, 10, 15, 20];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = arcCheeves[($scope.user.ltarcsTarget)];
                    
                    if ($scope.user.ltarcs == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltarcsTarget = $scope.user.ltarcsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Archive task
                taskFactory.update({userId: $scope.userId, taskId:$scope.task._id}, $scope.task).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task archived and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/tasks');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Archive task failed.");
                        }
                );
            
            };
            
            $scope.arcDeleteTask = function() {
                
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete task
                taskFactory.delete({userId: $scope.userId, taskId:$scope.task._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/tasksarc');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete task failed.");
                        }
                );
            
            };
            
            $scope.restoreTask = function() {
                
                // Flag task restored
                $scope.task.active = true;
                
                // Add to lifetime restore count and lifetime actions count
                $scope.user.ltrests = $scope.user.ltrests + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Restore task
                taskFactory.update({userId: $scope.userId, taskId:$scope.task._id}, $scope.task).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task restored and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/tasksarc');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Restore task failed.");
                        }
                );
            
            };
            
            $scope.performDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/taskperform.html', controller:"TaskDetailController" });
                
            };
            
            $scope.performTask = function() {
                
                // Update task count and add reward points to user total and lifetime total
                $scope.task.count = ($scope.task.count + 1);
                $scope.user.rpoints = ($scope.user.rpoints + $scope.task.points);
                $scope.user.ltrpoints = ($scope.user.ltrpoints + $scope.task.points);
                
                // Add to lifetime perf count and lifetime actions count
                $scope.user.ltperfs = $scope.user.ltperfs + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime perfs
                if ($scope.user.ltperfsTarget < 6) {
                    
                    var perfCheeves = [1, 10, 25, 50, 75, 100];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = perfCheeves[($scope.user.ltperfsTarget)];
                    
                    if ($scope.user.ltperfs == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltperfsTarget = $scope.user.ltperfsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Perform task
                taskFactory.update({userId: $scope.userId, taskId:$scope.task._id}, $scope.task).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Task performed and tracking updated!");
                                    ngDialog.close();
                                    $state.reload();
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Perform task failed.");
                        }
                );
            
            };
            
        }])

        .controller('RewardController', ['$scope', 'rewardFactory', 'AuthFactory', function($scope, rewardFactory, AuthFactory) {
          
            $scope.showRewards = false;
            $scope.message = "Loading...";
            $scope.sortType = [{name: "Title A-Z", val: "name"}, 
                               {name: "Title Z-A", val: "-name"}, 
                               {name: "Date Asc", val: "createdate"}, 
                               {name: "Date Desc", val: "-createdate"}];
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch all rewards data
            rewardFactory.query({userId: $scope.userId},
                function(response){
                    $scope.RewardList = response;
                    $scope.showRewards = true;
                    console.log("Rewards data loaded!");
                            },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
        }])

        .controller('RewardFormController', ['$scope', 'rewardFactory', 'userFactory', 'AuthFactory', '$location', function($scope, rewardFactory, userFactory, AuthFactory, $location) {
            
            $scope.rewardEntry = {name:"", notes:"", points:"", count:0, createdate:"", active:true};
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            $scope.submitReward = function() {
                
                // Add to lifetime reward count and lifetime actions count
                $scope.user.ltrewards = $scope.user.ltrewards + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime rewards
                if ($scope.user.ltrewardsTarget < 6) {
                    
                    var rewardCheeves = [1, 4, 8, 12, 16, 20];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = rewardCheeves[($scope.user.ltrewardsTarget)];
                    
                    if ($scope.user.ltrewards == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltrewardsTarget = $scope.user.ltrewardsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    var actionCheeves = [10, 50, 100, 200, 300];

                    // Determine achievement threshold and check if it's been reached
                    var actTarget = actionCheeves[($scope.user.ltactsTarget)];

                    if ($scope.user.ltacts == actTarget) {

                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltactsTarget = $scope.user.ltactsTarget + 1;

                    }
                
                }
                
                // Create reward
                $scope.rewardEntry.createdate = new Date().toISOString();
                rewardFactory.save({userId: $scope.userId}, $scope.rewardEntry).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward created and tracking updated!");
                                    $scope.rewardForm.$setPristine();
                                    $location.path('/rewards');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Create reward failed.");
                        }
                );
                
            };
                       
        }])

        .controller('RewardDetailController', ['$scope', '$stateParams', 'rewardFactory', 'userFactory', 'AuthFactory', 'ngDialog', '$location', '$state', function($scope, $stateParams, rewardFactory, userFactory, AuthFactory, ngDialog, $location, $state) {

            $scope.showReward = false;
            $scope.message = "Loading...";
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            // Fetch individual reward data
            $scope.reward = rewardFactory.get({userId: $scope.userId, rewardId:$stateParams.id}).$promise.then(
                function(response){
                    $scope.reward = response;
                    $scope.showReward = true;
                    console.log("Details for Reward " + $scope.reward._id + " loaded!");
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
            // Achievement check for lifetime actions (import to other functions to save space)
            $scope.checkActions = function () {
                
                var actionCheeves = [10, 50, 100, 200, 300];

                // Determine achievement threshold and check if it's been reached
                var actTarget = actionCheeves[($scope.user.ltactsTarget)];

                if ($scope.user.ltacts == actTarget) {

                    // If so, add 1 to user achievements and achievement target
                    $scope.user.cheeves = $scope.user.cheeves + 1;
                    $scope.user.ltactsTarget = $scope.user.ltactsTarget + 1;

                }
                
            }; // $scope.checkActions();
            
            $scope.editReward = function() {

                // Add to lifetime edit count and lifetime actions count
                $scope.user.ltedits = $scope.user.ltedits + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Edit reward
                rewardFactory.update({userId: $scope.userId, rewardId:$scope.reward._id}, $scope.reward).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward edited and tracking updated!");
                                    $scope.rewardForm.$setPristine();
                                    $location.path('/rewards');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Edit reward failed.");
                        }
                );
                                
            };
            
            $scope.deleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/rewarddelete.html', controller:"RewardDetailController" });
                
            };
            
            $scope.deleteReward = function() {
                
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete reward
                rewardFactory.delete({userId: $scope.userId, rewardId:$scope.reward._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/rewards');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete reward failed.");
                        }
                );
            
            };
            
            $scope.archiveDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/rewardarchive.html', controller:"RewardDetailController" });
                
            };
            
            $scope.arcDeleteDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/arcrewarddelete.html', controller:"RewardDetailController" });
                
            };
            
            $scope.arcRestoreDialog = function() {
                
                ngDialog.open({ template: 'views/dialogs/arcrewardrestore.html', controller:"RewardDetailController" });
                
            };
            
            $scope.archiveReward = function() {
                
                // Flag reward archived
                $scope.reward.active = false;
                
                // Add to lifetime archive count and lifetime actions count
                $scope.user.ltarcs = $scope.user.ltarcs + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime archives
                if ($scope.user.ltarcsTarget < 5) {
                    
                    var arcCheeves = [1, 5, 10, 15, 20];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = arcCheeves[($scope.user.ltarcsTarget)];
                    
                    if ($scope.user.ltarcs == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltarcsTarget = $scope.user.ltarcsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Archive reward
                rewardFactory.update({userId: $scope.userId, rewardId:$scope.reward._id}, $scope.reward).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward archived and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/rewards');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Archive reward failed.");
                        }
                );
            
            };
            
            $scope.arcDeleteReward = function() {
                
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Delete reward
                rewardFactory.delete({userId: $scope.userId, rewardId:$scope.reward._id}).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward deleted and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/rewardsarc');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Delete reward failed.");
                        }
                );
            
            };
            
            $scope.restoreReward = function() {
                
                // Flag reward restored
                $scope.reward.active = true;
                
                // Add to lifetime restore count and lifetime actions count
                $scope.user.ltrests = $scope.user.ltrests + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Restore reward
                rewardFactory.update({userId: $scope.userId, rewardId:$scope.reward._id}, $scope.reward).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward restored and tracking updated!");
                                    ngDialog.close();
                                    $location.path('/rewardsarc');
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Restore reward failed.");
                        }
                );
            
            };
            
            $scope.claimDialog = function() {
                
                if ($scope.reward.points > $scope.user.rpoints) {
                    
                    ngDialog.open({ template: 'views/dialogs/rewarddeny.html', controller:"RewardDetailController" });
                    
                } else {
                    
                    ngDialog.open({ template: 'views/dialogs/rewardclaim.html', controller:"RewardDetailController" });
                    
                }
                
            };
            
            $scope.claimReward = function() {
                
                // Update reward count and subtract reward points from user total
                $scope.reward.count = ($scope.reward.count + 1);
                $scope.user.rpoints = ($scope.user.rpoints - $scope.reward.points);
                
                // Add to lifetime claims count and lifetime actions count
                $scope.user.ltclaims = $scope.user.ltclaims + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime claims
                if ($scope.user.ltclaimsTarget < 6) {
                    
                    var claimCheeves = [1, 5, 10, 20, 30, 50];
                    
                    // Determine achievement threshold and check if it's been reached
                    var target = claimCheeves[($scope.user.ltclaimsTarget)];
                    
                    if ($scope.user.ltclaims == target) {
                        
                        // If so, add 1 to user achievements and achievement target
                        $scope.user.cheeves = $scope.user.cheeves + 1;
                        $scope.user.ltclaimsTarget = $scope.user.ltclaimsTarget + 1;
                        
                    }
                    
                }
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                
                // Claim reward
                rewardFactory.update({userId: $scope.userId, rewardId:$scope.reward._id}, $scope.reward).$promise.then(
                    function(response) { 
                            // Update tracking data
                            userFactory.update({userId: $scope.userId}, $scope.user).$promise.then(
                                function(response) { 
                                    console.log("Reward claimed and tracking updated!");
                                    ngDialog.close();
                                    $state.reload();
                                },
                                function(response) { 
                                    console.log("Update tracking failed.");
                                }
                            );
                        },
                        function(response) { 
                            console.log("Claim reward failed.");
                        }
                );
            
            };
            
        }])

        .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', '$location', 'AuthFactory', 'userFactory', function($scope, $state, $rootScope, ngDialog, $location, AuthFactory, userFactory) {
            
            $scope.loggedIn = false;
            $scope.username = '';
            $scope.userId = '';
            $scope.newUser = false;
            $scope.blankUser = { "rpoints": 0,
                                 "cheeves": 0,
                                 "trophies": 0,
                                 "ltrpoints": 0,
                                 "ltgoals": 0,
                                 "ltgoalsTarget": 0,
                                 "ltcomps": 0,
                                 "ltcompsTarget": 0,
                                 "lttasks": 0,
                                 "lttasksTarget": 0,
                                 "ltperfs": 0,
                                 "ltperfsTarget": 0,
                                 "ltrewards": 0,
                                 "ltrewardsTarget": 0,
                                 "ltclaims": 0,
                                 "ltclaimsTarget": 0,
                                 "ltarcs": 0,
                                 "ltarcsTarget": 0,
                                 "ltacts": 0,
                                 "ltactsTarget": 0,
                                 "lttrops": 0,
                                 "lttropsTarget": 0,
                                 "ltrests": 0,
                                 "ltcopies": 0,
                                 "ltedits": 0,
                                 "ltdels": 0 };

            // User Authentication
            if(AuthFactory.isAuthenticated()) {
                $scope.loggedIn = true;
                $scope.username = AuthFactory.getUsername();
                $scope.userId = AuthFactory.getUserId();
            }

            $scope.openLogin = function () {
                ngDialog.open({ template: 'views/dialogs/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
            };
            
            $scope.mustLogin = function () {
                ngDialog.open({ template: 'views/dialogs/require.html', scope: $scope, className: 'ngdialog-theme-default' });
            };
            
            $scope.openRegister = function () {
                
                ngDialog.open({ template: 'views/dialogs/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
                
            };

            $scope.logOut = function() {
               AuthFactory.logout();
                $scope.loggedIn = false;
                $scope.username = '';
                $scope.userId = '';
                $location.path('/'); // Return to home page when logged out
            };

            $rootScope.$on('login:Successful', function () {
                $scope.loggedIn = AuthFactory.isAuthenticated();
                $scope.username = AuthFactory.getUsername();
                $scope.userId = AuthFactory.getUserId();
                $scope.user = userFactory.get({userId: $scope.userId}); // Fetch user data on login
                $scope.newUser = AuthFactory.checkNew();
                // If new user, setup default tracking, reload user data and reset new user status
                if ($scope.newUser) {
                    
                    userFactory.save({userId: $scope.userId}, $scope.blankUser, 
                        function(response) { 
                            $scope.user = userFactory.get({userId: $scope.userId}); 
                        },
                        function(response) { 
                            console.log("Tracking setup failed.");
                        });
                    
                    AuthFactory.resetUser();
                    $scope.newUser = false;
                    
                }
            });

            $rootScope.$on('registration:Successful', function () {
                $scope.loggedIn = AuthFactory.isAuthenticated();
                $scope.username = AuthFactory.getUsername();
                $scope.userId = AuthFactory.getUserId();
            });
            
            // Fetch user data
            if ($scope.userId != '') {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }

            $scope.quotes = [{
                              "text": "Whatever the mind can conceive and believe, it can achieve.",
                              "author": "Napoleon Hill"
                            },
                            {
                              "text": "Two roads diverged in a wood, and I took the one less traveled. That has made all the difference.",
                              "author": "Robert Frost"
                            },
                            {
                              "text": "You miss 100% of the shots you don’t take.",
                              "author": "Wayne Gretzky"
                            },
                            {
                              "text": "The most difficult thing is the decision to act. The rest is merely tenacity. The fears are paper tigers. You can do anything you decide to do.",
                              "author": "Amelia Earhart"
                            },
                            {
                              "text": "Twenty years from now you will be more disappointed by the things you didn’t do than the things you did. So throw off the bowlines, cast off from safe harbor, catch the trade winds in your sails! Explore, dream, discover!",
                              "author": "Mark Twain"
                            },
                            {
                              "text": "Life is 10% what happens to me and 90% of how I react to it.",
                              "author": "Charles Swindoll"
                            },
                            {
                              "text": "Eighty percent of success is showing up.",
                              "author": "Woody Allen"
                            },
                            {
                              "text": "Winning isn’t everything, but wanting to win is.",
                              "author": "Vince Lombardi"
                            },
                            {
                              "text": "I am not a product of my circumstances. I am a product of my decisions.",
                              "author": "Stephen Covey"
                            },
                            {
                              "text": "Whether you think you can or you think you can’t, you’re right.",
                              "author": "Henry Ford"
                            },
                            {
                              "text": "Fall seven times and stand up eight.",
                              "author": "Japanese Proverb"
                            },
                            {
                              "text": "Whatever you can do, or dream you can, begin it. Boldness has genius, power and magic in it.",
                              "author": "Johann Wolfgang von Goethe"
                            },
                            {
                              "text": "The best revenge is massive success.",
                              "author": "Frank Sinatra"
                            },
                            {
                              "text": "People often say that motivation doesn’t last. Well, neither does bathing. That’s why we recommend it daily.",
                              "author": "Zig Ziglar"
                            },
                            {
                              "id": 14,
                              "text": "Life shrinks or expands in proportion to one’s courage.",
                              "author": "Anais Nin"
                            },
                            {
                              "text": "Go confidently in the direction of your dreams. Live the life you have imagined.",
                              "author": "Henry David Thoreau"
                            },
                            {
                              "text": "Believe you can and you’re halfway there.",
                              "author": "Theodore Roosevelt"
                            },
                            {
                              "text": "Happiness is not something readymade. It comes from your own actions.",
                              "author": "Dalai Lama"
                            },
                            {
                              "text": "The person who says it cannot be done should not interrupt the person who is doing it.",
                              "author": "Chinese Proverb"
                            },
                            {
                              "text": "It does not matter how slowly you go as long as you do not stop.",
                              "author": "Confucius"
                            },
                            {
                              "text": "If you do what you’ve always done, you’ll get what you’ve always gotten.",
                              "author": "Tony Robbins"
                            },
                            {
                              "text": "The greater danger for most of us lies not in setting our aim too high and falling short; but in setting our aim too low, and achieving our mark.",
                              "author": "Michelangelo"
                            },
                            {
                              "text": "Nothing can stop the man with the right mental attitude from achieving his goal; and nothing on earth can help the man with the wrong one.",
                              "author": "Thomas Jefferson"
                            },
                            {
                              "text": "Review your goals twice every day in order to be focused on achieving them.",
                              "author": "Les Brown"
                            },
                            {
                              "text": "Only I can change my life. No one can do it for me.",
                              "author": "Carol Burnett"
                            },
                            {
                              "text": "Always do your best. What you plant now, you will harvest later.",
                              "author": "Og Mandino"
                            },
                            {
                              "text": "It always seems impossible until it is done.",
                              "author": "Nelson Mandela"
                            },
                            {
                              "text": "Don't watch the clock; do what it does. Keep going.",
                              "author": "Sam Levenson"
                            },
                            {
                              "text": "Change your life today. Don't gamble on the future. Act now, without delay.",
                              "author": "Simone de Beauvoir"
                            },
                            {
                              "text": "When something is important enough, you do it even if the odds are not in your favor.",
                              "author": "Elon Musk"
                            }];
            
            // Grab random quote
            var randomIndex = Math.round( Math.random() * ($scope.quotes.length - 1) );
            
            $scope.randQuote = $scope.quotes[randomIndex];
            
        }])

        .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
            $scope.loginData = $localStorage.getObject('userinfo','{}');

            $scope.doLogin = function() {
                
                if($scope.rememberMe)
                   $localStorage.storeObject('userinfo',$scope.loginData);

                AuthFactory.login($scope.loginData);

                ngDialog.close();

            };

            $scope.openRegister = function () {
                
                ngDialog.open({ template: 'views/dialogs/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
                
            };

        }])

        .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

            $scope.register={};
            $scope.loginData={};

            $scope.doRegister = function() {

                AuthFactory.register($scope.registration);

                ngDialog.close();

            };
            
        }])

        .controller('CheeveController', ['$scope', 'userFactory', 'AuthFactory', function($scope, userFactory, AuthFactory) {
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            $scope.goalCheeves = [{name: "The First Step", val: 1},
                                  {name: "Priorities", val: 3},
                                  {name: "Goal Oriented", val: 6},
                                  {name: "Aiming High", val: 9},
                                  {name: "Lofty Ambitions", val: 12},
                                  {name: "Shooting For The Moon", val: 15}];
            
            $scope.compCheeves = [{name: "Just The Beginning", val: 1},
                                  {name: "Feels Good, Doesn't It?", val: 3},
                                  {name: "On A Roll", val: 5},
                                  {name: "Determination", val: 7},
                                  {name: "Dreams Fulfilled", val: 9}];
            
            $scope.taskCheeves = [{name: "Blueprint", val: 1},
                                  {name: "Organizer", val: 5},
                                  {name: "Expanding The Scope", val: 10},
                                  {name: "Strategist", val: 15},
                                  {name: "Grand Design", val: 20},
                                  {name: "Master Plan", val: 25}];
            
            $scope.perfCheeves = [{name: "Off To The Races", val: 1},
                                  {name: "Action, Not Words", val: 10},
                                  {name: "Well Disciplined", val: 25},
                                  {name: "Better, Faster, Stronger", val: 50},
                                  {name: "Unstoppable", val: 75},
                                  {name: "Task Master", val: 100}];
            
            $scope.rewardCheeves = [{name: "Dangling The Carrot", val: 1},
                                  {name: "More Motivation", val: 4},
                                  {name: "Enticing, Aren't They?", val: 8},
                                  {name: "Impressive Impetus", val: 12},
                                  {name: "A Buffet Of Incentives", val: 16},
                                  {name: "The Good Life", val: 20}];
            
            $scope.claimCheeves = [{name: "Gimme!", val: 1},
                                  {name: "Positive Reinforcement", val: 5},
                                  {name: "Well Deserved", val: 10},
                                  {name: "To The Victor, The Spoils", val: 20},
                                  {name: "Hard Work Rewarded", val: 30},
                                  {name: "An Embarrassment Of Riches", val: 50}];
            
            $scope.actionCheeves = [{name: "Learning The Ropes", val: 10},
                                  {name: "Full Swing", val: 50},
                                  {name: "Power User", val: 100},
                                  {name: "Cruising To Success", val: 200},
                                  {name: "Task Master Pro", val: 300}];
            
            $scope.archCheeves = [{name: "Maybe Later", val: 1},
                                  {name: "Full Plate", val: 5},
                                  {name: "Another Time Perhaps", val: 10},
                                  {name: "Shelved But Not Forgotten", val: 15},
                                  {name: "Archivist", val: 20}];
            
            $scope.trophyCheeves = [{name: "Winner!", val: 1},
                                  {name: "How Sweet It Is", val: 2},
                                  {name: "Look At All The Bling", val: 4},
                                  {name: "All I Do Is Win", val: 6},
                                  {name: "Champion Of The Ages", val: 8}];
            
        }])

        .controller('StatController', ['$scope', 'goalFactory', 'userFactory', 'AuthFactory', function($scope, goalFactory, userFactory, AuthFactory) {
            
            // Fetch user ID
            $scope.userId = AuthFactory.getUserId();
            
            // Fetch user data
            if ($scope.userId != undefined) {
                
                $scope.user = userFactory.get({userId: $scope.userId});
                
            }
            
            // Fetch goals data and run determine function
            goalFactory.query({userId: $scope.userId}, 
                 function(response){
                                $scope.goals = response;
                                $scope.determine();
                            },
                            function(response) {
                                console.log("Error: " + response.status + " " + response.statusText);
                            }
            );
            
            // Determine number of gold, silver and bronze trophies user currently holds
            $scope.determine = function () {
                
                $scope.goldCount = 0;
                $scope.silverCount = 0;
                $scope.bronzeCount = 0;
                
                // for each entry in goals array
                for (x = 0; x < $scope.goals.length; x++) {
                    // check only goals marked as complete and with a trophy present
                    if ($scope.goals[x].complete === true && $scope.goals[x].award != "0") {
                        // count by trophy type
                        switch($scope.goals[x].award) {
                                
                            case "3": $scope.goldCount++;
                                break;
                            case "2": $scope.silverCount++;
                                break;
                            case "1": $scope.bronzeCount++;
                                
                        }
                        
                    }
                    
                }
                
                
            };
            
        }])

        // shave timestamp off UI Boostrap Datepicker dates
        .directive('datepickerLocaldate', ['$parse', function ($parse) {
            
            var directive = {
                restrict: 'A',
                require: ['ngModel'],
                link: link
            };
            
            return directive;

            function link(scope, element, attr, ctrls) {
                var ngModelController = ctrls[0];

                // called with a JavaScript Date object when picked from the datepicker
                ngModelController.$parsers.push(function (viewValue) {
                    
                    console.log(viewValue);
                    
                    // check to see if Date value is being cleared
                    if (viewValue === null) {
                        return viewValue;
                    } else {
                        // undo the timezone adjustment we did during the formatting
                        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
                        // we just want a local date in ISO format
                        return viewValue.toISOString().substring(0, 10);                      
                    }
                    
                });
                
            }
            
        }])

;