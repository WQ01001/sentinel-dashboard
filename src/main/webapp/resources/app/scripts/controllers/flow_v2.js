var app = angular.module('sentinelDashboardApp');

app.controller('FlowControllerV2', ['$scope', '$stateParams', 'FlowServiceV2', 'ngDialog',
  'MachineService',
  function ($scope, $stateParams, FlowService, ngDialog,
    MachineService) {
    $scope.app = $stateParams.app;

    $scope.rulesPageConfig = {
      pageSize: 10,
      currentPageIndex: 1,
      totalPage: 1,
      totalCount: 0,
    };
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

    $scope.generateThresholdTypeShow = (rule) => {
      if (!rule.clusterMode) {
        return 'Single';
      }
      if (rule.clusterConfig.thresholdType === 0) {
        return 'Cluster Average';
      } else if (rule.clusterConfig.thresholdType === 1) {
        return 'Cluster Total';
      } else {
        return 'Cluster';
      }
    };

    getMachineRules();
    function getMachineRules() {
      if (!$scope.macInputModel) {
        return;
      }
      var mac = $scope.macInputModel.split(':');
      FlowService.queryMachineRules($scope.app, mac[0], mac[1]).success(
        function (data) {
          if (data.code == 0 && data.data) {
            $scope.rules = data.data;
            $scope.rulesPageConfig.totalCount = $scope.rules.length;
          } else {
            $scope.rules = [];
            $scope.rulesPageConfig.totalCount = 0;
          }
        });
    };
    $scope.getMachineRules = getMachineRules;

    var flowRuleDialog;
    $scope.editRule = function (rule) {
      $scope.currentRule = angular.copy(rule);
      $scope.flowRuleDialog = {
        title: 'Edit Flow Control Rule',
        type: 'edit',
        confirmBtnText: 'Save',
        showAdvanceButton: rule.controlBehavior == 0 && rule.strategy == 0
      };
      flowRuleDialog = ngDialog.open({
        template: '/app/views/dialog/flow-rule-dialog.html',
        width: 680,
        overlay: true,
        scope: $scope
      });
    };

    $scope.addNewRule = function () {
      var mac = $scope.macInputModel.split(':');
      $scope.currentRule = {
        grade: 1,
        strategy: 0,
        controlBehavior: 0,
        app: $scope.app,
        ip: mac[0],
        port: mac[1],
        limitApp: 'default',
        clusterMode: false,
        clusterConfig: {
          thresholdType: 0,
          fallbackToLocalWhenFail: true
        }
      };
      $scope.flowRuleDialog = {
        title: 'Add Flow Control Rule',
        type: 'add',
        confirmBtnText: 'Add',
        showAdvanceButton: true,
      };
      flowRuleDialog = ngDialog.open({
        template: '/app/views/dialog/flow-rule-dialog.html',
        width: 680,
        overlay: true,
        scope: $scope
      });
    };

    $scope.saveRule = function () {
      if (!FlowService.checkRuleValid($scope.currentRule)) {
        return;
      }
      if ($scope.flowRuleDialog.type === 'add') {
        addNewRule($scope.currentRule);
      } else if ($scope.flowRuleDialog.type === 'edit') {
        saveRule($scope.currentRule, true);
      }
    };

    var confirmDialog;
    $scope.deleteRule = function (rule) {
      $scope.currentRule = rule;
      $scope.confirmDialog = {
        title: 'Delete Flow Control Rule',
        type: 'delete_rule',
        attentionTitle: 'Please confirm to delete the following flow control rule',
        attention: 'Resource: ' + rule.resource + ', Control App: ' + rule.limitApp
          + ', Threshold Type: ' + (rule.grade == 0 ? 'Thread Count' : 'QPS') + ', Threshold: ' + rule.count,
        confirmBtnText: 'Delete',
      };
      confirmDialog = ngDialog.open({
        template: '/app/views/dialog/confirm-dialog.html',
        scope: $scope,
        overlay: true
      });
    };

    $scope.confirm = function () {
      if ($scope.confirmDialog.type === 'delete_rule') {
        deleteRule($scope.currentRule);
      } else {
        console.error('error');
      }
    };

    function deleteRule(rule) {
      FlowService.deleteRule(rule).success(function (data) {
        if (data.code == 0) {
          getMachineRules();
          confirmDialog.close();
        } else {
          alert('Failed!');
        }
      });
    };

    function addNewRule(rule) {
      FlowService.newRule(rule).success(function (data) {
        if (data.code == 0) {
          getMachineRules();
          flowRuleDialog.close();
        } else {
          alert('Failed!');
        }
      });
    };

    $scope.onOpenAdvanceClick = function () {
      $scope.flowRuleDialog.showAdvanceButton = false;
    };
    $scope.onCloseAdvanceClick = function () {
      $scope.flowRuleDialog.showAdvanceButton = true;
    };

    function saveRule(rule, edit) {
      FlowService.saveRule(rule).success(function (data) {
        if (data.code == 0) {
          getMachineRules();
          if (edit) {
            flowRuleDialog.close();
          } else {
            confirmDialog.close();
          }
        } else {
          alert('Failed!');
        }
      });
    }
    queryAppMachines();
    function queryAppMachines() {
      MachineService.getAppMachines($scope.app).success(
        function (data) {
          if (data.code == 0) {
            // $scope.machines = data.data;
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
    };
    $scope.$watch('macInputModel', function () {
      if ($scope.macInputModel) {
        getMachineRules();
      }
    });
  }]);
