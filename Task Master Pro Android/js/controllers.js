angular.module('TMPIonic.controllers', [])

        .controller('GoalController', ['$scope', 'goalFactory', 'userFactory', '$ionicModal', 'ionicDatePicker', '$ionicTabsDelegate', '$localStorage', function($scope, goalFactory, userFactory, $ionicModal, ionicDatePicker, $ionicTabsDelegate, $localStorage) {
            
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Create goals array in storage if it doesn't exist
            if(!$scope.storage.goals) {
                $scope.storage.goals = [];
            }
            
            // Sorters
            $scope.sortType1 = [{name: "Sort", val: ""},
                               {name: "Title A-Z", val: "name"}, 
                               {name: "Title Z-A", val: "-name"}, 
                               {name: "Created Asc", val: "createdate"}, 
                               {name: "Created Desc", val: "-createdate"}, 
                               {name: "Due Asc", val: "date"}, 
                               {name: "Due Desc", val: "-date"}];
            $scope.sortType2 = [{name: "Sort", val: ""},
                                {name: "Title A-Z", val: "name"}, 
                                {name: "Title Z-A", val: "-name"}, 
                                {name: "Created Asc", val: "createdate"}, 
                                {name: "Created Desc", val: "-createdate"}, 
                                {name: "Completed Asc", val: "date"}, 
                                {name: "Completed Desc", val: "-date"}, 
                                {name: "Trophies Highest", val: "-award"}, 
                                {name: "Trophies Lowest", val: "award"}];
            
            // Fetch all goals data   
            $scope.GoalList = goalFactory.getGoals();
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Re-direct to proper tab when necessary (check every time view is opened)
            $scope.$on('$ionicView.enter', function() {
                
                $scope.tab = goalFactory.getTargetTab();
                
                if ($scope.tab != undefined) {
                    
                    if ($scope.tab == 0) {
                        $ionicTabsDelegate.select(0);
                    } else if ($scope.tab == 1) {
                        $ionicTabsDelegate.select(1);
                    } else if ($scope.tab == 2) {
                        $ionicTabsDelegate.select(2);
                    }

                    goalFactory.setTargetTab(undefined);

                }
                
            });
            
            // Change sort menu based on selected tab
            $scope.selectSort = function(setTab) {
                
                $scope.sort = "";
                
                if (setTab === 1) {
                    $scope.sortMenu = $scope.sortType1;
                }
                else {
                    $scope.sortMenu = $scope.sortType2;
                }
            };
            
            // Create Add Goal modal and open
            $scope.addGoal = function() {
                
               $scope.goalEntry = {id:0, name:"", notes:"", date:null, points:0, award:"0", createdate:null, active:true, complete:false};
                
               $ionicModal.fromTemplateUrl('templates/goals/goaladd.html', {
                   scope: $scope
               }).then(function(modal) {
                   $scope.addGoalModal = modal;
                   $scope.addGoalModal.show();
               });

            };
            
            // Close Add Goal modal
            $scope.closeAddGoal = function() {              
               $scope.addGoalModal.hide();      
            };
            
            var datePick = {
                  // Receive date pick data
                  callback: function (val) {
                    // Set due date, remove time info, leaving only date info
                    $scope.goalEntry.date = new Date(val).toISOString().substring(0, 10);
                  }
            };
               
            // Call Date Picker
            $scope.pickDate = function() {
               ionicDatePicker.openDatePicker(datePick);
            };
            
            $scope.submitGoal = function() {
                
                // Create goal, assign creation date and unique ID
                $scope.goalEntry.createdate = new Date().toISOString();
                if ($scope.storage.goals.length < 1) {
                    $scope.goalEntry.id = 1;
                } else {
                    $scope.goalEntry.id = $scope.storage.goals[$scope.storage.goals.length - 1].id + 1;
                }
                $scope.storage.goals.push($scope.goalEntry);
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
                // Save user data
                $scope.storage.user = $scope.user;
                $scope.closeAddGoal();
                $ionicTabsDelegate.select(0);
                
            };
            
            $scope.targetGoal = function(target) {
                
                goalFactory.setTargetId(target);
                
            };
            
        }])

        .controller('GoalDetailController', ['$scope', '$state', 'goalFactory', 'userFactory', 'ngDialog', '$ionicModal', 'ionicDatePicker', '$localStorage', function($scope, $state, goalFactory, userFactory, ngDialog, $ionicModal, ionicDatePicker, $localStorage) {
            
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Fetch target goal data
            $scope.goal = goalFactory.getGoal();
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Determine goal position in storage array
            for (var i = 0; i < $scope.storage.goals.length; i++) {
                
                if ($scope.storage.goals[i].id == $scope.goal.id) {
                        
                    var arrayPosition = i;
                  
                }
        
            }
            
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
                
            };

            // Open Edit Goal modal
            $scope.editGoal = function() {
                
                $scope.goalEdit = angular.copy($scope.goal);
               
                $ionicModal.fromTemplateUrl('templates/goals/goaledit.html', {
                   scope: $scope
                }).then(function(modal) {
                   $scope.editGoalModal = modal;
                   $scope.editGoalModal.show();
                });

            };
            
            // Close Edit Goal modal
            $scope.closeEditGoal = function() {
               $scope.editGoalModal.hide();
            };
            
            var editPick = {
                  // Receive date pick data
                  callback: function (val) {
                    // Set due date, remove time info, leaving only date info
                    $scope.goalEdit.date = new Date(val).toISOString().substring(0, 10);
                  }
            };
            
            // Call Date Picker for edit
            $scope.editDate = function() {
               ionicDatePicker.openDatePicker(editPick);
            };
            
            $scope.submitEdit = function() {
                
                // Edit goal
                $scope.storage.goals[arrayPosition] = $scope.goalEdit;
                $scope.goal = angular.copy($scope.goalEdit);
                // Add to lifetime edit count and lifetime actions count
                $scope.user.ltedits = $scope.user.ltedits + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                $scope.closeEditGoal();
                    
            };
            
            $scope.deleteDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/goaldelete.html', controller:"GoalDetailController" });
                
            };
            
            $scope.deleteGoal = function() {
                
                // If goal is completed and trophy present, delete trophy from user total
                if (($scope.goal.complete == true) && ($scope.goal.award != "0")){
                    $scope.user.trophies = $scope.user.trophies - 1;
                }
                // Delete goal
                $scope.storage.goals.splice(arrayPosition, 1);
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                ngDialog.close();
                $state.go('app.goals');
            
            };
            
            $scope.archiveDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/goalarchive.html', controller:"GoalDetailController" });
                
            };
            
            $scope.restoreDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/goalrestore.html', controller:"GoalDetailController" });
                
            };
            
            $scope.archiveGoal = function() {
                
                // Move goal to Archives
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
                // Save changes
                $scope.storage.goals[arrayPosition] = $scope.goal;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                goalFactory.setTargetTab(1);
                $state.go('app.goals');
            
            };
            
            $scope.restoreGoal = function() {
                
                // Restore goal from Archives to active Goals list
                $scope.goal.active = true;
                // Add to lifetime restore count and lifetime actions count
                $scope.user.ltrests = $scope.user.ltrests + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.goals[arrayPosition] = $scope.goal;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                goalFactory.setTargetTab(0);
                $state.go('app.goals');
            
            };
            
            $scope.completeDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/goalcomplete.html', controller:"GoalDetailController" });
                
            };
            
            $scope.completeGoal = function() {
                
                // Move goal to Completed
                $scope.goal.active = false;
                $scope.goal.complete = true;
                // Change the Due Date to Completed Date
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
                // Save changes
                $scope.storage.goals[arrayPosition] = $scope.goal;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                goalFactory.setTargetTab(2);
                $state.go('app.goals');
            
            };
            
            $scope.deleteCompDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/goaldelete2.html', controller:"GoalDetailController" });
                
            };
            
            $scope.copyDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/goalcopy.html', controller:"GoalDetailController" });
                
            };
            
            $scope.copyGoal = function() {
                
                $scope.goalCopy = {id:0, name:"", notes:"", date:null, points:"", award:"0", createdate:"", active:true, complete:false};
                
                // Copy old goal data to new goal
                $scope.goalCopy.name = $scope.goal.name;
                $scope.goalCopy.notes = $scope.goal.notes;
                $scope.goalCopy.points = $scope.goal.points;
                $scope.goalCopy.award = $scope.goal.award;
                // Create new Id
                $scope.goalCopy.id = $scope.storage.goals[$scope.storage.goals.length - 1].id + 1;
                // New create date
                $scope.goalCopy.createdate = new Date().toISOString();
                // Create goal
                $scope.storage.goals.push($scope.goalCopy);
                // Add to lifetime copy count and lifetime actions count
                $scope.user.ltcopies = $scope.user.ltcopies + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                ngDialog.close();
                goalFactory.setTargetTab(0);
                $state.go('app.goals');
                
            };
            
        }])

        .controller('TaskController', ['$scope', 'taskFactory', 'userFactory', '$ionicModal', '$ionicTabsDelegate', '$localStorage', function($scope, taskFactory, userFactory, $ionicModal, $ionicTabsDelegate, $localStorage) {
          
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Create tasks array in storage if it doesn't exist
            if(!$scope.storage.tasks) {
                $scope.storage.tasks = [];
            }
            
            $scope.sortType = [{name: "Sort", val: ""},
                               {name: "Title A-Z", val: "name"}, 
                               {name: "Title Z-A", val: "-name"}, 
                               {name: "Date Asc", val: "createdate"}, 
                               {name: "Date Desc", val: "-createdate"}];
            
            $scope.resetSort = function() {
                
                $scope.sort = "";
                
            };
            
            // Fetch all tasks data   
            $scope.TaskList = taskFactory.getTasks();
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Re-direct to proper tab when necessary (check every time view is opened)
            $scope.$on('$ionicView.enter', function() {
                
                $scope.tab = taskFactory.getTargetTab();
                
                if ($scope.tab != undefined) {
                    
                    if ($scope.tab == 0) {
                        $ionicTabsDelegate.select(0);
                    } else if ($scope.tab == 1) {
                        $ionicTabsDelegate.select(1);
                    }

                    taskFactory.setTargetTab(undefined);

                }
                
            });
            
            // Create Add Task modal and open
            $scope.addTask = function() {
                
               $scope.taskEntry = {id:0, name:"", notes:"", freq:"", points:0, count:0, createdate:"", active:true};
                
               $ionicModal.fromTemplateUrl('templates/tasks/taskadd.html', {
                   scope: $scope
               }).then(function(modal) {
                   $scope.addTaskModal = modal;
                   $scope.addTaskModal.show();
               });

            };
            
            // Close Add Task modal
            $scope.closeAddTask = function() {
               $scope.addTaskModal.hide();
            };
            
            $scope.submitTask = function() {
                
                // Create task, assign creation date and unique ID
                $scope.taskEntry.createdate = new Date().toISOString();
                if ($scope.storage.tasks.length < 1) {
                    $scope.taskEntry.id = 1;
                } else {
                    $scope.taskEntry.id = $scope.storage.tasks[$scope.storage.tasks.length - 1].id + 1;
                }
                $scope.storage.tasks.push($scope.taskEntry);
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
                // Save user data
                $scope.storage.user = $scope.user;
                $scope.closeAddTask();
                $ionicTabsDelegate.select(0);
                
            };
            
            $scope.targetTask = function(target) {
                
                taskFactory.setTargetId(target);
                
            };
            
        }])

        .controller('TaskDetailController', ['$scope', '$state', 'taskFactory', 'userFactory', 'ngDialog', '$ionicModal', '$localStorage', function($scope, $state, taskFactory, userFactory, ngDialog, $ionicModal, $localStorage) {
            
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Fetch target task data
            $scope.task = taskFactory.getTask();
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Determine task position in storage array
            for (var i = 0; i < $scope.storage.tasks.length; i++) {
                
                if ($scope.storage.tasks[i].id == $scope.task.id) {
                        
                    var arrayPosition = i;
                  
                }
        
            }
            
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
                
            };
            
            // Open Edit Task modal
            $scope.editTask = function() {
                
                $scope.taskEdit = angular.copy($scope.task);
               
                $ionicModal.fromTemplateUrl('templates/tasks/taskedit.html', {
                   scope: $scope
                }).then(function(modal) {
                   $scope.editTaskModal = modal;
                   $scope.editTaskModal.show();
                });

            };
            
            // Close Edit Task modal
            $scope.closeEditTask = function() {
               $scope.editTaskModal.hide();
            };
            
            $scope.submitEdit = function() {
                
                // Edit task entry
                $scope.storage.tasks[arrayPosition] = $scope.taskEdit;
                $scope.task = angular.copy($scope.taskEdit);
                // Add to lifetime edit count and lifetime actions count
                $scope.user.ltedits = $scope.user.ltedits + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                $scope.closeEditTask();
                
            };
            
            $scope.deleteDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/taskdelete.html', controller:"TaskDetailController" });
                
            };
            
            $scope.deleteTask = function() {
                
                // Delete task entry
                $scope.storage.tasks.splice(arrayPosition, 1);
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                ngDialog.close();
                $state.go('app.tasks');
            
            };
            
            $scope.archiveDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/taskarchive.html', controller:"TaskDetailController" });
                
            };
            
            
            $scope.restoreDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/taskrestore.html', controller:"TaskDetailController" });
                
            };
            
            $scope.archiveTask = function() {
                
                // Move task to Archives
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
                // Save changes
                $scope.storage.tasks[arrayPosition] = $scope.task;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                taskFactory.setTargetTab(1);
                $state.go('app.tasks');
            
            };
            
            $scope.restoreTask = function() {
                
                // Restore task from Archives to active Tasks list
                $scope.task.active = true;
                // Add to lifetime restore count and lifetime actions count
                $scope.user.ltrests = $scope.user.ltrests + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.tasks[arrayPosition] = $scope.task;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                taskFactory.setTargetTab(0);
                $state.go('app.tasks');
            
            };
            
            $scope.performDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/taskperform.html', controller:"TaskDetailController" });
                
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
                // Save changes
                $scope.storage.tasks[arrayPosition] = $scope.task;
                $scope.storage.user = $scope.user;
                ngDialog.close();
            
            };
            
        }])

        .controller('RewardController', ['$scope', 'rewardFactory', 'userFactory', '$ionicModal', '$ionicTabsDelegate', '$localStorage', function($scope, rewardFactory, userFactory, $ionicModal, $ionicTabsDelegate, $localStorage) {

            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Create rewards array in storage if it doesn't exist
            if(!$scope.storage.rewards) {
                $scope.storage.rewards = [];
            }
            
            $scope.sortType = [{name: "Sort", val: ""},
                               {name: "Title A-Z", val: "name"}, 
                               {name: "Title Z-A", val: "-name"}, 
                               {name: "Date Asc", val: "createdate"}, 
                               {name: "Date Desc", val: "-createdate"}];
            
            $scope.resetSort = function() {
                
                $scope.sort = "";
                
            };
            
            // Fetch all tasks data
            $scope.RewardList = rewardFactory.getRewards();
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Re-direct to proper tab when necessary (check every time view is opened)
            $scope.$on('$ionicView.enter', function() {
                
                $scope.tab = rewardFactory.getTargetTab();
                
                if ($scope.tab != undefined) {
                    
                    if ($scope.tab == 0) {
                        $ionicTabsDelegate.select(0);
                    } else if ($scope.tab == 1) {
                        $ionicTabsDelegate.select(1);
                    }

                    rewardFactory.setTargetTab(undefined);

                }
                
            });
            
            // Create Add Reward modal and open
            $scope.addReward = function() {

               $scope.rewardEntry = {id:0, name:"", notes:"", points:0, count:0, createdate:"", active:true};
                
               $ionicModal.fromTemplateUrl('templates/rewards/rewardadd.html', {
                   scope: $scope
               }).then(function(modal) {
                   $scope.addRewardModal = modal;
                   $scope.addRewardModal.show();
               });

            };
            
            // Close Add Reward modal
            $scope.closeAddReward = function() {
               $scope.addRewardModal.hide();
            };
            
            $scope.submitReward = function() {
                
                // Create reward, assign creation date and unique ID
                $scope.rewardEntry.createdate = new Date().toISOString();
                if ($scope.storage.rewards.length < 1) {
                    $scope.rewardEntry.id = 1;
                } else {
                    $scope.rewardEntry.id = $scope.storage.rewards[$scope.storage.rewards.length - 1].id + 1;
                }
                $scope.storage.rewards.push($scope.rewardEntry);
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
                // Save user data
                $scope.storage.user = $scope.user;
                $scope.closeAddReward();
                $ionicTabsDelegate.select(0);
                
            };
            
            $scope.targetReward = function(target) {
                
                rewardFactory.setTargetId(target);
                
            };
            
        }])

        .controller('RewardDetailController', ['$scope', '$state', 'rewardFactory', 'userFactory', 'ngDialog', '$ionicModal', '$localStorage', function($scope, $state, rewardFactory, userFactory, ngDialog, $ionicModal, $localStorage) {
            
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Fetch target reward data
            $scope.reward = rewardFactory.getReward();
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Determine reward position in storage array
            for (var i = 0; i < $scope.storage.rewards.length; i++) {
                
                if ($scope.storage.rewards[i].id == $scope.reward.id) {
                        
                    var arrayPosition = i;
                  
                }
        
            }
            
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
                
            };
            
            // Open Edit Reward modal
            $scope.editReward = function() {
                
                $scope.rewardEdit = angular.copy($scope.reward);
               
                $ionicModal.fromTemplateUrl('templates/rewards/rewardedit.html', {
                   scope: $scope
                }).then(function(modal) {
                   $scope.editRewardModal = modal;
                   $scope.editRewardModal.show();
                });

            };
            
            // Close Edit Reward modal
            $scope.closeEditReward = function() {
               $scope.editRewardModal.hide();
            };
            
            $scope.submitEdit = function() {

                // Edit reward entry
                $scope.storage.rewards[arrayPosition] = $scope.rewardEdit;
                $scope.reward = angular.copy($scope.rewardEdit);
                // Add to lifetime edit count and lifetime actions count
                $scope.user.ltedits = $scope.user.ltedits + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                $scope.closeEditReward();
            
            };
            
            $scope.deleteDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/rewarddelete.html', controller:"RewardDetailController" });
                
            };
            
            $scope.deleteReward = function() {
                
                // Delete reward entry
                $scope.storage.rewards.splice(arrayPosition, 1);
                // Add to lifetime delete count and lifetime actions count
                $scope.user.ltdels = $scope.user.ltdels + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.user = $scope.user;
                ngDialog.close();
                $state.go('app.rewards');
            
            };
            
            $scope.archiveDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/rewardarchive.html', controller:"RewardDetailController" });
                
            };
            
            
            $scope.restoreDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/rewardrestore.html', controller:"RewardDetailController" });
                
            };
            
            $scope.archiveReward = function() {
                
                // Move reward to Archives
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
                // Save changes
                $scope.storage.rewards[arrayPosition] = $scope.reward;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                rewardFactory.setTargetTab(1);
                $state.go('app.rewards');
            
            };
            
            $scope.restoreReward = function() {
                
                // Restore reward from Archives to active Rewards list
                $scope.reward.active = true;
                // Add to lifetime restore count and lifetime actions count
                $scope.user.ltrests = $scope.user.ltrests + 1;
                $scope.user.ltacts = $scope.user.ltacts + 1;
                // Achievement check for lifetime actions
                if ($scope.user.ltactsTarget < 5) {
                    
                    $scope.checkActions();
                
                }
                // Save changes
                $scope.storage.rewards[arrayPosition] = $scope.reward;
                $scope.storage.user = $scope.user;
                ngDialog.close();
                rewardFactory.setTargetTab(0);
                $state.go('app.rewards');
            
            };
            
            $scope.claimDialog = function() {
                
                if ($scope.reward.points > $scope.user.rpoints) {
                    
                    ngDialog.open({ template: 'templates/dialogs/rewarddeny.html', controller:"RewardDetailController" });
                    
                } else {
                    
                    ngDialog.open({ template: 'templates/dialogs/rewardclaim.html', controller:"RewardDetailController" });
                    
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
                // Save changes
                $scope.storage.rewards[arrayPosition] = $scope.reward;
                $scope.storage.user = $scope.user;
                ngDialog.close();
            
            };
            
        }])

        .controller('HeaderController', ['$scope', '$ionicSideMenuDelegate', '$localStorage', function($scope, $ionicSideMenuDelegate, $localStorage) {
            
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Create user object in storage if it doesn't exist
            if(!$scope.storage.user) {
                $scope.storage.user = {"rpoints": 0,
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
                                       "ltdels": 0,
                                       "reminder": 0};
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
                              "text": "The most difficult thing is the decision to act. The rest is merely tenacity. The fears are paper tigers. You can do anything.",
                              "author": "Amelia Earhart"
                            },
                            {
                              "text": "Twenty years from now you'll be more disappointed by the things you didn’t do than the things you did.",
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
            
            // Grab random quote each time side menu is accessed
            $scope.$watch(function () {
               return $ionicSideMenuDelegate.isOpenLeft();
              },
              function (isOpen) {
                if (isOpen) {
                    
                  var randomIndex = Math.round( Math.random() * ($scope.quotes.length - 1) );
            
                  $scope.randQuote = $scope.quotes[randomIndex];
                    
                }
             });
            
        }])

        .controller('UserController', ['$scope', 'userFactory', function($scope, userFactory) {
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
        }])

        .controller('CheeveController', ['$scope', 'userFactory', function($scope, userFactory) {
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
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

        .controller('StatController', ['$scope', 'goalFactory', 'userFactory', function($scope, goalFactory, userFactory) {
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Fetch trophy count (update every time view is opened)
            $scope.$on('$ionicView.enter', function() {
                
                $scope.trophies = goalFactory.countTrophies();
                
                $scope.goldCount = $scope.trophies[0];
                $scope.silverCount = $scope.trophies[1];
                $scope.bronzeCount = $scope.trophies[2];
                
            });
            
        }])

        .controller('OptionController', ['$scope', '$state', 'userFactory', '$localStorage', '$ionicPlatform', '$ionicHistory', 'ngDialog', function($scope, $state, userFactory, $localStorage, $ionicPlatform, $ionicHistory, ngDialog) {
            
            // Link scope storage and local storage
            $scope.storage = $localStorage;
            
            // Fetch user data
            $scope.user = userFactory.getUser();
            
            // Initialize radio button
            $scope.radio = { choice: undefined };
            
            // Set scope choice to user's stored choice
            $scope.radio.choice = angular.copy($scope.user.reminder);
            
            // Initialize toggle (to enable manual control later)
            $scope.toggle = { checked: false };
            
            $scope.setReminder = function() {
                
                // Create date object, set time to 6 AM
                var cDate = new Date();
                cDate.setHours(6, 0, 0, 0);
                
                $scope.title = "Task Master Pro";
                $scope.text = "Keep working toward your goals!";
                
                // If reminder choice is anything but "no reminder"
                if ($scope.radio.choice != 0) {
                    // Determine starting date and frequency based on user's choice
                    switch($scope.radio.choice) {

                        case 1: $scope.frequency = "day";
                                // set target date to tomorrow
                                cDate.setDate(cDate.getDate() + 1);
                                $scope.rDate = cDate;
                                break;
                        case 2: $scope.frequency = "week";
                                // set target date to next Monday
                                cDate.setDate(cDate.getDate() + (7 - cDate.getDay()) % 7 + 1);
                                $scope.rDate = cDate;
                                break;
                        case 3: $scope.frequency = "month";
                                // set target date to the first day of the next month
                                cDate.setMonth((cDate.getMonth() + 1), 1);
                                $scope.rDate = cDate;
                        /*        break;
                        case 4: $scope.frequency = "hour";
                                $scope.rDate = new Date();
                                break;
                        case 5: $scope.frequency = "minute";
                                $scope.rDate = new Date(); */

                    }
                    // Schedule notification if it doesn't exist, otherwise update it
                    if ($scope.user.reminder == 0 && $scope.radio.choice > 0) {
                        
                        $scope.user.reminder = angular.copy($scope.radio.choice);
                        $scope.storage.user.reminder = angular.copy($scope.radio.choice);
                    
                        $ionicPlatform.ready(function () {
                                
                                cordova.plugins.notification.local.schedule({
                                    id: 1,
                                    title: $scope.title,
                                    text: $scope.text,
                                    firstAt: $scope.rDate,
                                    every: $scope.frequency
                                });

                        });

                    } else if ($scope.user.reminder > 0 && $scope.radio.choice > 0) {
                        
                        $scope.user.reminder = angular.copy($scope.radio.choice);
                        $scope.storage.user.reminder = angular.copy($scope.radio.choice);
                        
                        $ionicPlatform.ready(function () {
                                
                                cordova.plugins.notification.local.update({
                                    id: 1,
                                    title: $scope.title,
                                    text: $scope.text,
                                    firstAt: $scope.rDate,
                                    every: $scope.frequency
                                });

                        });

                    }
                
                } else if ($scope.radio.choice == 0) {
                    // Cancel notification
                    $scope.user.reminder = angular.copy($scope.radio.choice);
                    $scope.storage.user.reminder = angular.copy($scope.radio.choice);

                    $ionicPlatform.ready(function () {
                        
                        cordova.plugins.notification.local.cancelAll();

                    });
                    
                }
                
                // ngDialog.open({ template: 'templates/dialogs/reminder.html', controller:"OptionController" });
                
            };
            
            $scope.resetDialog = function() {
                
                ngDialog.open({ template: 'templates/dialogs/resetapp.html', controller:"OptionController" });
                
            };
            
            $scope.resetApp = function() {
            
                $scope.storage.goals = [];
                $scope.storage.tasks = [];
                $scope.storage.rewards = [];
                
                $scope.storage.user = {"rpoints": 0,
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
                                       "ltdels": 0,
                                       "reminder": 0};
                
                // Clear notification
                $ionicPlatform.ready(function () {

                    cordova.plugins.notification.local.cancelAll(function () {
                        console.log("Canceled notification!");
                    }, this);

                });
                
                // Clear Ionic cache for all pages
                $ionicHistory.clearCache(['app.home', 'app.goals', 'app.tasks', 'app.rewards', 'app.cheeves', 'app.stats', 'app.options', 'app.about']).then(function(){$state.go('app.home');});
                ngDialog.close();
                
            };
            
            // Disable back button if user resets and goes to home page
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            
        }])

;