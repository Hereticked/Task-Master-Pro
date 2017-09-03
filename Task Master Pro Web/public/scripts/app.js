angular.module('TaskMasterPro', ['ui.router','ngResource','ngDialog','ui.bootstrap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }

            })
        
            // route for the goals page
            .state('app.goals', {
                url:'goals',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/goals/goals.html',
                        controller  : 'GoalController'
                    }
                }
            })
        
            // route for the add goal page
            .state('app.goaladd', {
                url:'addgoal',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/goals/goaladd.html',
                        controller  : 'GoalFormController'                
                    }
                }
            })
        
            // route for the goal details page
            .state('app.goaldetails', {
                url:'goals/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/goals/goaldetails.html',
                        controller  : 'GoalDetailController'                
                    }
                }
            })
        
            // route for the edit goal page
            .state('app.goaledit', {
                url:'editgoal/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/goals/goaledit.html',
                        controller  : 'GoalDetailController'             
                    }
                }
            })
        
            // route for the archived goals page
            .state('app.goals.arc', {
                url:'arc',
                views: {
                    'content@': {
                        templateUrl : 'views/goals/goalarc.html',
                        controller  : 'GoalController'
                    }
                }
            })
        
            // route for the archived goal details page
            .state('app.arcgoaldetails', {
                url: 'arcgoaldetails/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/goals/goalarcdetails.html',
                        controller  : 'GoalDetailController'
                   }
                }
            })
        
            // route for the completed goals page
            .state('app.goals.comp', {
                url:'comp',
                views: {
                    'content@': {
                        templateUrl : 'views/goals/goalcomp.html',
                        controller  : 'GoalController'
                    }
                }
            })
        
            // route for the completed goal details page
            .state('app.compgoaldetails', {
                url: 'compgoaldetails/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/goals/goalcompdetails.html',
                        controller  : 'GoalDetailController'
                   }
                }
            })
        
            // route for the tasks page
            .state('app.tasks', {
                url:'tasks',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/tasks/tasks.html',
                        controller  : 'TaskController'                  
                    }
                }
            })
        
            // route for the add task page
            .state('app.taskadd', {
                url:'addtask',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/tasks/taskadd.html',
                        controller  : 'TaskFormController'                
                    }
                }
            })
        
            // route for the task details page
            .state('app.taskdetails', {
                url:'tasks/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/tasks/taskdetails.html',
                        controller  : 'TaskDetailController'                
                    }
                }
            })
        
            // route for the edit task page
            .state('app.taskedit', {
                url:'edittask/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/tasks/taskedit.html',
                        controller  : 'TaskDetailController'             
                    }
                }
            })
        
            // route for the archived tasks page
            .state('app.tasks.arc', {
                url:'arc',
                views: {
                    'content@': {
                        templateUrl : 'views/tasks/taskarc.html',
                        controller  : 'TaskController'
                    }
                }
            })
        
            // route for the archived task details page
            .state('app.arctaskdetails', {
                url: 'arctaskdetails/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/tasks/taskarcdetails.html',
                        controller  : 'TaskDetailController'
                   }
                }
            })

            // route for the rewards page
            .state('app.rewards', {
                url: 'rewards',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/rewards/rewards.html',
                        controller  : 'RewardController'
                    }
                }
            })
        
            // route for the add reward page
            .state('app.rewardadd', {
                url: 'addreward',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/rewards/rewardadd.html',
                        controller  : 'RewardFormController'
                    }
                }
            })
        
            // route for the reward details page
            .state('app.rewarddetails', {
                url: 'rewards/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/rewards/rewarddetails.html',
                        controller  : 'RewardDetailController'
                    }
                }
            })
        
            // route for the edit reward page
            .state('app.rewardedit', {
                url: 'editreward/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/rewards/rewardedit.html',
                        controller  : 'RewardDetailController'
                    }
                }
            })
        
            // route for the archived rewards page
            .state('app.rewards.arc', {
                url:'arc',
                views: {
                    'content@': {
                        templateUrl : 'views/rewards/rewardarc.html',
                        controller  : 'RewardController'
                    }
                }
            })
        
            // route for the archived reward details page
            .state('app.arcrewarddetails', {
                url: 'arcrewarddetails/:id',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/rewards/rewardarcdetails.html',
                        controller  : 'RewardDetailController'
                   }
                }
            })
        
            // route for the achievements page
            .state('app.cheeves', {
                url: 'cheeves',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/cheeves.html',
                        controller  : 'CheeveController'
                   }
                }
            })

            // route for the statistics page
            .state('app.stats', {
                url: 'stats',
                views: {
                    'header@': {
                        templateUrl : 'views/header2.html',
                        controller  : 'HeaderController'
                    },
                    'content@': {
                        templateUrl : 'views/stats.html',
                        controller  : 'StatController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;