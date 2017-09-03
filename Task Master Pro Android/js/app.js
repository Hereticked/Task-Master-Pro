angular.module('TMPIonic', ['ionic', 'TMPIonic.controllers', 'TMPIonic.services', 'ionic-datepicker', 'ngDialog', 'ngStorage', 'ngCordova'])

.run(function($ionicPlatform) {
    
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $localStorageProvider) {
    
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'HeaderController'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'mainContent': {
        templateUrl: 'templates/home.html',
        controller: 'UserController'
      }
    }
  })

  .state('app.goals', {
      url: '/goals/',
      views: {
        'mainContent': {
          templateUrl: 'templates/goals/goals.html',
          controller: 'GoalController'
        }
      }
   })
    
  .state('app.goaldetails', {
    url: '/goal/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/goals/goaldetails.html',
        controller: 'GoalDetailController'
      }
    }
  })
  
  .state('app.arcgoaldetails', {
    url: '/arcgoals/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/goals/goalarcdetails.html',
        controller: 'GoalDetailController'
      }
    }
  })
    
  .state('app.compgoaldetails', {
    url: '/compgoals/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/goals/goalcompdetails.html',
        controller: 'GoalDetailController'
      }
    }
  })
    
  .state('app.tasks', {
      url: '/tasks/',
      views: {
        'mainContent': {
          templateUrl: 'templates/tasks/tasks.html',
          controller: 'TaskController'
        }
      }
   })

  .state('app.taskdetails', {
    url: '/task/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/tasks/taskdetails.html',
        controller: 'TaskDetailController'
      }
    }
  })

  .state('app.rewards', {
      url: '/rewards/',
      views: {
        'mainContent': {
          templateUrl: 'templates/rewards/rewards.html',
          controller: 'RewardController'
        }
      }
   })
    
  .state('app.rewarddetails', {
    url: '/reward/:id',
    views: {
      'mainContent': {
        templateUrl: 'templates/rewards/rewarddetails.html',
        controller: 'RewardDetailController'
      }
    }
  })
    
  .state('app.cheeves', {
    url: '/cheeves',
    views: {
      'mainContent': {
        templateUrl: 'templates/cheeves.html',
        controller: 'CheeveController'
      }
    }
  })
    
  .state('app.stats', {
    url: '/stats',
    views: {
      'mainContent': {
        templateUrl: 'templates/stats.html',
        controller: 'StatController'
      }
    }
  })
    
  .state('app.options', {
    url: '/options',
    views: {
      'mainContent': {
        templateUrl: 'templates/options.html',
        controller: 'OptionController'
      }
    }
  })
    
  .state('app.about', {
    url: '/about',
    views: {
      'mainContent': {
        templateUrl: 'templates/about.html',
        controller: 'UserController'
      }
    }
  })

;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
  
  // Keep title in Ionic navbar to the left
  $ionicConfigProvider.navBar.alignTitle('left');
    
  // Keep Ionic tabs on bottom
  $ionicConfigProvider.tabs.position('bottom');
    
  // No text with Side Menu back button
  $ionicConfigProvider.backButton.previousTitleText(false);
  $ionicConfigProvider.backButton.text('');
    
  // Remove ngStorage key prefix
  $localStorageProvider.setKeyPrefix('');
  
});