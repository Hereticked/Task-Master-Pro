angular.module('TMPIonic.services', [])

        .factory('goalFactory', ['$localStorage', function($localStorage) {
            
            var targetId;
            var targetGoal;
            var targetTab;

            var _getGoals = function () {
                return $localStorage.goals;
            };
            
            var _getGoal = function () {
                
                for (var i = 0; i < $localStorage.goals.length; i++) {
                
                    if ($localStorage.goals[i].id == targetId) {
                        
                        targetGoal = $localStorage.goals[i];
                  
                    }
        
                }
                
                return targetGoal;
                
            };
            
            var _setTargetId = function (goalid) {
                targetId = goalid;
            };
            
            var _setTargetTab = function (tabid) {
                targetTab = tabid;
            };
            
            var _getTargetTab = function () {
                return targetTab;
            };
            
            var _countTrophies = function () {
                
                var gold = 0;
                var silver = 0;
                var bronze = 0;                
                
                // for each entry in goals array
                for (var x = 0; x < $localStorage.goals.length; x++) {
                    // check only goals marked as complete and with a trophy present
                    if ($localStorage.goals[x].complete === true && $localStorage.goals[x].award != "0") {
                        // count by trophy type
                        switch($localStorage.goals[x].award) {
                                
                            case "3": gold++;
                                break;
                            case "2": silver++;
                                break;
                            case "1": bronze++;
                                
                        }
                        
                    }
                    
                }
                
                var trophies = [gold, silver, bronze];
                
                return trophies;
            
            };
            
            return {
                getGoals: _getGoals,
                getGoal: _getGoal,
                setTargetId: _setTargetId,
                setTargetTab: _setTargetTab,
                getTargetTab: _getTargetTab,
                countTrophies: _countTrophies
            };

        }])

        .factory('taskFactory', ['$localStorage', function($localStorage) {
            
            var targetId;
            var targetTask;
            var targetTab;

            var _getTasks = function () {
                return $localStorage.tasks;
            };
            
            var _getTask = function () {
                
                for (var i = 0; i < $localStorage.tasks.length; i++) {
                
                    if ($localStorage.tasks[i].id == targetId) {
                        
                        targetTask = $localStorage.tasks[i];
                  
                    }
        
                }
                
                return targetTask;
                
            };
            
            var _setTargetId = function (taskid) {
                targetId = taskid;
            };
            
            var _setTargetTab = function (tabid) {
                targetTab = tabid;
            };
            
            var _getTargetTab = function () {
                return targetTab;
            };
            
            return {
                getTasks: _getTasks,
                getTask: _getTask,
                setTargetId: _setTargetId,
                setTargetTab: _setTargetTab,
                getTargetTab: _getTargetTab
            };

        }])

        .factory('rewardFactory', ['$localStorage', function($localStorage) {
            
            var targetId;
            var targetReward;
            var targetTab;

            var _getRewards = function () {
                return $localStorage.rewards;
            };
            
            var _getReward = function () {
                
                for (var i = 0; i < $localStorage.rewards.length; i++) {
                
                    if ($localStorage.rewards[i].id == targetId) {
                        
                        targetReward = $localStorage.rewards[i];
                  
                    }
        
                }
                
                return targetReward;
                
            };
            
            var _setTargetId = function (rewardid) {
                targetId = rewardid;
            };
            
            var _setTargetTab = function (tabid) {
                targetTab = tabid;
            };
            
            var _getTargetTab = function () {
                return targetTab;
            };
            
            return {
                getRewards: _getRewards,
                getReward: _getReward,
                setTargetId: _setTargetId,
                setTargetTab: _setTargetTab,
                getTargetTab: _getTargetTab
            };

        }])

        .factory('userFactory', ['$localStorage', function($localStorage) {

            var _getUser = function () {
                return $localStorage.user;
            };
            
            return {
                getUser: _getUser
            };

        }])

;