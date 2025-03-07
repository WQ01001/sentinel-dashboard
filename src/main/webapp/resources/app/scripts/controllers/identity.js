var app = angular.module('sentinelDashboardApp');

app.controller('IdentityCtl', ['$scope', '$stateParams', 'IdentityService',
  'ngDialog', 'FlowServiceV1', 'DegradeService', 'AuthorityRuleService', 'ParamFlowService', 'MachineService',
  '$interval', '$location', '$timeout',
  function ($scope, $stateParams, IdentityService, ngDialog,
    FlowService, DegradeService, AuthorityRuleService, ParamFlowService, MachineService, $interval, $location, $timeout) {

    $scope.app = $stateParams.app;

    $scope.currentPage = 1;
    $scope.pageSize = 16;
    $scope.totalPage = 1;
    $scope.totalCount = 0;
    $scope.identities = [];
    // Default data refresh interval: 10s
    var DATA_REFRESH_INTERVAL = 30;

    $scope.isExpand = true;
    $scope.searchKey = '';
    $scope.firstExpandAll = false;
    $scope.isTreeView = true;

    $scope.macsInputConfig = {
      searchField: ['text', 'value'],
      persist: true,
      create: false,
      maxItems: 1,
      render: {
        item: function (data, escape) {
          return '<div>' + escape(data.text) + '</div>';
        }
      },
      onChange: function (value, oldValue) {
        $scope.macInputModel = value;
      }
    };
    $scope.table = null;

    var flowRuleDialog;
    var flowRuleDialogScope;
    $scope.addNewFlowRule = function (resource) {
      if (!$scope.macInputModel) {
        return;
      }
      var mac = $scope.macInputModel.split(':');
      flowRuleDialogScope = $scope.$new(true);
      flowRuleDialogScope.currentRule = {
        enable: false,
        strategy: 0,
        grade: 1,
        controlBehavior: 0,
        resource: resource,
        limitApp: 'default',
        clusterMode: false,
        clusterConfig: {
            thresholdType: 0
        },
        app: $scope.app,
        ip: mac[0],
        port: mac[1]
      };

      flowRuleDialogScope.flowRuleDialog = {
        title: 'Add Flow Control Rule',
        type: 'add',
        confirmBtnText: 'Add',
        saveAndContinueBtnText: 'Add and Continue',
        showAdvanceButton: true
      };
      flowRuleDialogScope.saveRule = saveFlowRule;
      flowRuleDialogScope.saveRuleAndContinue = saveFlowRuleAndContinue;
      flowRuleDialogScope.onOpenAdvanceClick = function () {
        flowRuleDialogScope.flowRuleDialog.showAdvanceButton = false;
      };
      flowRuleDialogScope.onCloseAdvanceClick = function () {
        flowRuleDialogScope.flowRuleDialog.showAdvanceButton = true;
      };

      flowRuleDialog = ngDialog.open({
        template: '/app/views/dialog/flow-rule-dialog.html',
        width: 680,
        overlay: true,
        scope: flowRuleDialogScope
      });
    };

    function saveFlowRule() {
      if (!FlowService.checkRuleValid(flowRuleDialogScope.currentRule)) {
        return;
      }
      FlowService.newRule(flowRuleDialogScope.currentRule).success(function (data) {
        if (data.code === 0) {
          flowRuleDialog.close();
          let url = '/dashboard/flow/' + $scope.app;
          $location.path(url);
        } else {
          alert('Failed: ' + data.msg);
        }
      }).error((data, header, config, status) => {
          alert('Unknown error');
      });
    }

    function saveFlowRuleAndContinue() {
        if (!FlowService.checkRuleValid(flowRuleDialogScope.currentRule)) {
            return;
        }
      FlowService.newRule(flowRuleDialogScope.currentRule).success(function (data) {
        if (data.code === 0) {
          flowRuleDialog.close();
        } else {
            alert('Failed: ' + data.msg);
        }
      });
    }

    var degradeRuleDialog;
    var degradeRuleDialogScope;
    $scope.addNewDegradeRule = function (resource) {
      if (!$scope.macInputModel) {
        return;
      }
      var mac = $scope.macInputModel.split(':');
      degradeRuleDialogScope = $scope.$new(true);
      degradeRuleDialogScope.currentRule = {
        enable: false,
        grade: 0,
        strategy: 0,
        resource: resource,
        limitApp: 'default',
        minRequestAmount: 5,
        statIntervalMs: 1000,
        app: $scope.app,
        ip: mac[0],
        port: mac[1]
      };

      degradeRuleDialogScope.degradeRuleDialog = {
        title: 'Add Circuit Breaking Rule',
        type: 'add',
        confirmBtnText: 'Add',
        saveAndContinueBtnText: 'Add and Continue'
      };
      degradeRuleDialogScope.saveRule = saveDegradeRule;
      degradeRuleDialogScope.saveRuleAndContinue = saveDegradeRuleAndContinue;

      degradeRuleDialog = ngDialog.open({
        template: '/app/views/dialog/degrade-rule-dialog.html',
        width: 680,
        overlay: true,
        scope: degradeRuleDialogScope
      });
    };

    function saveDegradeRule() {
        if (!DegradeService.checkRuleValid(degradeRuleDialogScope.currentRule)) {
            return;
        }
      DegradeService.newRule(degradeRuleDialogScope.currentRule).success(function (data) {
        if (data.code === 0) {
          degradeRuleDialog.close();
          var url = '/dashboard/degrade/' + $scope.app;
          $location.path(url);
        } else {
          alert('Failed: ' + data.msg);
        }
      });
    }

    function saveDegradeRuleAndContinue() {
        if (!DegradeService.checkRuleValid(degradeRuleDialogScope.currentRule)) {
            return;
        }
      DegradeService.newRule(degradeRuleDialogScope.currentRule).success(function (data) {
        if (data.code === 0) {
          degradeRuleDialog.close();
        } else {
            alert('Failed: ' + data.msg);
        }
      });
    }

      let authorityRuleDialog;
      let authorityRuleDialogScope;

      function saveAuthorityRule() {
          let ruleEntity = authorityRuleDialogScope.currentRule;
          if (!AuthorityRuleService.checkRuleValid(ruleEntity.rule)) {
              return;
          }
          AuthorityRuleService.addNewRule(ruleEntity).success((data) => {
              if (data.success) {
                  authorityRuleDialog.close();
                  let url = '/dashboard/authority/' + $scope.app;
                  $location.path(url);
              } else {
                  alert('Failed to add rule: ' + data.msg);
              }
          }).error((data) => {
              if (data) {
                  alert('Failed to add rule: ' + data.msg);
              } else {
                  alert("Failed to add rule: Unknown error");
              }
          });
      }

      function saveAuthorityRuleAndContinue() {
          let ruleEntity = authorityRuleDialogScope.currentRule;
          if (!AuthorityRuleService.checkRuleValid(ruleEntity.rule)) {
              return;
          }
          AuthorityRuleService.addNewRule(ruleEntity).success((data) => {
              if (data.success) {
                  authorityRuleDialog.close();
              } else {
                  alert('Failed to add rule: ' + data.msg);
              }
          }).error((data) => {
              if (data) {
                  alert('Failed to add rule: ' + data.msg);
              } else {
                  alert("Failed to add rule: Unknown error");
              }
          });
      }

      $scope.addNewAuthorityRule = function (resource) {
          if (!$scope.macInputModel) {
              return;
          }
          let mac = $scope.macInputModel.split(':');
          authorityRuleDialogScope = $scope.$new(true);
          authorityRuleDialogScope.currentRule = {
              app: $scope.app,
              ip: mac[0],
              port: mac[1],
              rule: {
                  resource: resource,
                  strategy: 0,
                  limitApp: '',
              }
          };

          authorityRuleDialogScope.authorityRuleDialog = {
              title: 'Add Authority Rule',
              type: 'add',
              confirmBtnText: 'Add',
              saveAndContinueBtnText: 'Add and Continue'
          };
          authorityRuleDialogScope.saveRule = saveAuthorityRule;
          authorityRuleDialogScope.saveRuleAndContinue = saveAuthorityRuleAndContinue;

          authorityRuleDialog = ngDialog.open({
              template: '/app/views/dialog/authority-rule-dialog.html',
              width: 680,
              overlay: true,
              scope: authorityRuleDialogScope
          });
      };

      let paramFlowRuleDialog;
      let paramFlowRuleDialogScope;

      function saveParamFlowRule() {
          let ruleEntity = paramFlowRuleDialogScope.currentRule;
          if (!ParamFlowService.checkRuleValid(ruleEntity.rule)) {
              return;
          }
          ParamFlowService.addNewRule(ruleEntity).success((data) => {
              if (data.success) {
                  paramFlowRuleDialog.close();
                  let url = '/dashboard/paramFlow/' + $scope.app;
                  $location.path(url);
              } else {
                  alert('Failed to add hotspot rule: ' + data.msg);
              }
          }).error((data) => {
              if (data) {
                  alert('Failed to add hotspot rule: ' + data.msg);
              } else {
                  alert("Failed to add hotspot rule: Unknown error");
              }
          });
      }

      function saveParamFlowRuleAndContinue() {
          let ruleEntity = paramFlowRuleDialogScope.currentRule;
          if (!ParamFlowService.checkRuleValid(ruleEntity.rule)) {
              return;
          }
          ParamFlowService.addNewRule(ruleEntity).success((data) => {
              if (data.success) {
                  paramFlowRuleDialog.close();
              } else {
                  alert('Failed to add hotspot rule: ' + data.msg);
              }
          }).error((data) => {
              if (data) {
                  alert('Failed to add hotspot rule: ' + data.msg);
              } else {
                  alert("Failed to add hotspot rule: Unknown error");
              }
          });
      }

      $scope.addNewParamFlowRule = function (resource) {
          if (!$scope.macInputModel) {
              return;
          }
          let mac = $scope.macInputModel.split(':');
          paramFlowRuleDialogScope = $scope.$new(true);
          paramFlowRuleDialogScope.currentRule = {
              app: $scope.app,
              ip: mac[0],
              port: mac[1],
              rule: {
                  resource: resource,
                  grade: 1,
                  paramFlowItemList: [],
                  count: 0,
                  limitApp: 'default',
                  controlBehavior: 0,
                  durationInSec: 1,
                  burstCount: 0,
                  maxQueueingTimeMs: 0,
                  clusterMode: false,
                  clusterConfig: {
                      thresholdType: 0,
                      fallbackToLocalWhenFail: true,
                  }
              }
          };

          paramFlowRuleDialogScope.paramFlowRuleDialog = {
              title: 'Add Hotspot Rule',
              type: 'add',
              confirmBtnText: 'Add',
              saveAndContinueBtnText: 'Add and Continue',
              supportAdvanced: false,
              showAdvanceButton: true
          };
          paramFlowRuleDialogScope.saveRule = saveParamFlowRule;
          paramFlowRuleDialogScope.saveRuleAndContinue = saveParamFlowRuleAndContinue;

          paramFlowRuleDialog = ngDialog.open({
              template: '/app/views/dialog/param-flow-rule-dialog.html',
              width: 680,
              overlay: true,
              scope: paramFlowRuleDialogScope
          });
      };

    var searchHandler;
    $scope.searchChange = function (searchKey) {
      $timeout.cancel(searchHandler);
      searchHandler = $timeout(function () {
        $scope.searchKey = searchKey;
        $scope.isExpand = true;
        $scope.firstExpandAll = true;
        reInitIdentityDatas();
        $scope.firstExpandAll = false;
      }, 600);
    };

    $scope.initTreeTable = function () {
      com_github_culmat_jsTreeTable.register(window);
      $scope.table = window.treeTable($('#identities'));
    };

    $scope.expandAll = function () {
      $scope.isExpand = true;
    };
    $scope.collapseAll = function () {
      $scope.isExpand = false;
    };
    $scope.treeView = function () {
      $scope.isTreeView = true;
      queryIdentities();
    };
    $scope.listView = function () {
      $scope.isTreeView = false;
      queryIdentities();
    };

    function queryAppMachines() {
      MachineService.getAppMachines($scope.app).success(
        function (data) {
          if (data.code === 0) {
            if (data.data) {
              $scope.machines = [];
              $scope.macsInputOptions = [];
              data.data.forEach(function (item) {
                if (item.healthy) {
                  $scope.macsInputOptions.push({
                    text: item.ip + ':' + item.port,
                    value: item.ip + ':' + item.port
                  });
                }
              });
            }
            if ($scope.macsInputOptions.length > 0) {
              $scope.macInputModel = $scope.macsInputOptions[0].value;
            }
          } else {
            $scope.macsInputOptions = [];
          }
        }
      );
    }

    // Fetch all machines by current app name.
    queryAppMachines();

    $scope.$watch('macInputModel', function () {
      if ($scope.macInputModel) {
        reInitIdentityDatas();
      }
    });

    $scope.$on('$destroy', function () {
      $interval.cancel(intervalId);
    });

    var intervalId;
    function reInitIdentityDatas() {
      queryIdentities();
    };

    function queryIdentities() {
      var mac = $scope.macInputModel.split(':');
      if (mac == null || mac.length < 2) {
        return;
      }
      if ($scope.isTreeView) {
        IdentityService.fetchIdentityOfMachine(mac[0], mac[1], $scope.searchKey).success(
          function (data) {
            if (data.code == 0 && data.data) {
              $scope.identities = data.data;
              $scope.totalCount = $scope.identities.length;
            } else {
              $scope.identities = [];
              $scope.totalCount = 0;
            }
          }
        );
      } else {
        IdentityService.fetchClusterNodeOfMachine(mac[0], mac[1], $scope.searchKey).success(
          function (data) {
            if (data.code == 0 && data.data) {
              $scope.identities = data.data;
              $scope.totalCount = $scope.identities.length;
            } else {
              $scope.identities = [];
              $scope.totalCount = 0;
            }
          }
        );
      }
    };
    $scope.queryIdentities = queryIdentities;
  }]);
