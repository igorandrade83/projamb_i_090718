(function($app) {

  var isoDate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

  /**
   * Função que retorna o formato que será utilizado no componente
   * capturando o valor do atributo format do elemento, para mais formatos
   * consulte os formatos permitidos em http://momentjs.com/docs/#/parsing/string-format/
   *
   */
  var patternFormat = function(element) {
    if (element) {
      return $(element).attr('format') || 'DD/MM/YYYY';
    }
    return 'DD/MM/YYYY';
  }

  var parsePermission = function(perm) {
    var result = {
      visible: {
        public: true
      },
      enabled: {
        public: true
      }
    }

    if (perm) {
      var perms = perm.toLowerCase().trim().split(",");
      for (var i=0;i<perms.length;i++) {
        var p = perms[i].trim();
        if (p) {
          var pair = p.split(":");
          if (pair.length == 2) {
            var key = pair[0].trim();
            var value = pair[1].trim();
            if (value) {
              var values = value.split(";");
              var json = {};
              for (var j=0;j<values.length;j++) {
                var v = values[j].trim();
                if (v) {
                  json[v] = true;
                }
              }
              result[key] = json;
            }
          }
        }
      }
    }
    return result;
  }

  app.directive('asDate', maskDirectiveAsDate)

      .directive('ngDestroy', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs, ctrl) {
            element.on('$destroy', function() {
              if (attrs.ngDestroy && attrs.ngDestroy.length > 0)
                if (attrs.ngDestroy.indexOf('app.') > -1 || attrs.ngDestroy.indexOf('blockly.') > -1)
                  scope.$eval(attrs.ngDestroy);
                else
                  eval(attrs.ngDestroy);
            });
          }
        }
      })

      .directive('dynamicImage', function($compile) {
        var template = '';
        return {
          restrict: 'E',
          replace: true,
          scope: {
            ngModel: '@',
            width: '@',
            height: '@',
            style: '@',
            class: '@'
          },
          require: 'ngModel',
          template: '<div></div>',
          init: function(s) {
            if (!s.ngModel)
              s.ngModel = '';
            if (!s.width)
              s.width = '128';
            if (!s.height)
              s.height = '128';
            if (!s.style)
              s.style = '';
            if (!s.class)
              s.class = '';
            if (!this.containsLetter(s.width))
              s.width += 'px';
            if (!this.containsLetter(s.height))
              s.height += 'px';
          },
          containsLetter: function(value) {
            var containsLetter;
            for (var i=0; i<value.length; i++) {
              containsLetter = true;
              for (var number = 0; number <10; number++)
                if (parseInt(value[i]) == number)
                  containsLetter = false;
              if (containsLetter)
                break;
            }
            return containsLetter;
          },
          link: function(scope, element, attr) {
            this.init(scope);
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");
            var templateDyn    = '<div class="form-group upload-image-component" ngf-drop="" ngf-drag-over-class="dragover">\
                                  <img class="$class$" style="$style$; height: $height$; width: $width$;" ng-if="$ngModel$" data-ng-src="{{$ngModel$.startsWith(\'http\') || ($ngModel$.startsWith(\'/\') && $ngModel$.length < 1000)? $ngModel$ : \'data:image/png;base64,\' + $ngModel$}}">\
                                  <img class="$class$" style="$style$; height: $height$; width: $width$;" ng-if="!$ngModel$" data-ng-src="/plugins/cronapp-framework-js/img/selectImg.svg" class="btn" ng-if="!$ngModel$" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.setFile(\'$ngModel$\', $file)" accept="image/*;capture=camera">\
                                  <div class="remove btn btn-danger btn-xs" ng-if="$ngModel$" ng-click="$ngModel$=null">\
                                    <span class="glyphicon glyphicon-remove"></span>\
                                  </div>\
                                  <div class="btn btn-info btn-xs start-camera-button" ng-if="!$ngModel$" ng-click="cronapi.internal.startCamera(\'$ngModel$\')">\
                                    <span class="glyphicon glyphicon-facetime-video"></span>\
                                  </div>\
                                  <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important; margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                                </div>';
            element.append(templateDyn
                .split('$height$').join(s.height)
                .split('$width$').join(s.width)
                .split('$ngModel$').join(s.ngModel)
                .split('$style$').join(s.style)
                .split('$class$').join(s.class)
                .split('$required$').join(required)
            );


            $compile(element)(element.scope());
          }
        }
      })
      .directive('dynamicImage', function($compile) {
        var template = '';
        return {
          restrict: 'A',
          scope: true,
          require: 'ngModel',
          link: function(scope, element, attr) {
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");
            var content = element.html();
            var templateDyn    =
                '<div ngf-drop="" ngf-drag-over-class="dragover">\
                   <img style="width: 100%;" ng-if="$ngModel$" data-ng-src="{{$ngModel$.startsWith(\'http\') || ($ngModel$.startsWith(\'/\') && $ngModel$.length < 1000)? $ngModel$ : \'data:image/png;base64,\' + $ngModel$}}">\
                   <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important; margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                   <div class="btn" ng-if="!$ngModel$" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.setFile(\'$ngModel$\', $file)" ngf-pattern="\'image/*\'" ngf-max-size="$maxFileSize$">\
                     $userHtml$\
                   </div>\
                   <div class="remove-image-button btn btn-danger btn-xs" ng-if="$ngModel$" ng-click="$ngModel$=null">\
                     <span class="glyphicon glyphicon-remove"></span>\
                   </div>\
                   <div class="btn btn-info btn-xs start-camera-button-attribute" ng-if="!$ngModel$" ng-click="cronapi.internal.startCamera(\'$ngModel$\')">\
                     <span class="glyphicon glyphicon-facetime-video"></span>\
                   </div>\
                 </div>';
            var maxFileSize = "";
            if (attr.maxFileSize)
              maxFileSize = attr.maxFileSize;

            templateDyn = $(templateDyn
                .split('$ngModel$').join(attr.ngModel)
                .split('$required$').join(required)
                .split('$userHtml$').join(content)
                .split('$maxFileSize$').join(maxFileSize)
            );

            element.html(templateDyn);
            $compile(templateDyn)(element.scope());
          }
        }
      })
      .directive('dynamicFile', function($compile) {
        var template = '';
        return {
          restrict: 'A',
          scope: true,
          require: 'ngModel',
          link: function(scope, element, attr) {
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");

            var splitedNgModel = attr.ngModel.split('.');
            var datasource = splitedNgModel[0];
            var field = splitedNgModel[splitedNgModel.length-1];
            var number = Math.floor((Math.random() * 1000) + 20);
            var content = element.html();

            var maxFileSize = "";
            if (attr.maxFileSize)
              maxFileSize = attr.maxFileSize;

            var templateDyn    = '\
                                <div ng-show="!$ngModel$" ngf-drop="" ngf-drag-over-class="dragover">\
                                  <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important;margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                                  <div class="btn" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.uploadFile(\'$ngModel$\', $file, \'uploadprogress$number$\')" ngf-max-size="$maxFileSize$">\
                                    $userHtml$\
                                  </div>\
                                  <div class="progress" data-type="bootstrapProgress" id="uploadprogress$number$" style="display:none">\
                                    <div class="progress-bar" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width:0%">\
                                      <span class="sr-only"></span>\
                                    </div>\
                                  </div>\
                                </div> \
                                <div ng-show="$ngModel$" class="upload-image-component-attribute"> \
                                  <div class="btn btn-danger btn-xs ng-scope" style="float:right;" ng-if="$ngModel$" ng-click="$ngModel$=null"> \
                                    <span class="glyphicon glyphicon-remove"></span> \
                                  </div> \
                                  <div> \
                                    <div ng-bind-html="cronapi.internal.generatePreviewDescriptionByte($ngModel$)"></div> \
                                    <a href="javascript:void(0)" ng-click="cronapi.internal.downloadFileEntity($datasource$,\'$field$\')">download</a> \
                                  </div> \
                                </div> \
                                ';
            templateDyn = $(templateDyn
                .split('$ngModel$').join(attr.ngModel)
                .split('$datasource$').join(datasource)
                .split('$field$').join(field)
                .split('$number$').join(number)
                .split('$required$').join(required)
                .split('$userHtml$').join(content)
                .split('$maxFileSize$').join(maxFileSize)

            );

            element.html(templateDyn);
            $compile(templateDyn)(element.scope());
          }
        }
      })
      .directive('dynamicFile', function($compile) {
        var template = '';
        return {
          restrict: 'E',
          replace: true,
          scope: {
            ngModel: '@',
          },
          require: 'ngModel',
          template: '<div></div>',
          init: function(s) {
            if (!s.ngModel)
              s.ngModel = '';
          },
          link: function(scope, element, attr) {
            this.init(scope);
            var s = scope;
            var required = (attr.ngRequired && attr.ngRequired == "true"?"required":"");

            var splitedNgModel = s.ngModel.split('.');
            var datasource = splitedNgModel[0];
            var field = splitedNgModel[splitedNgModel.length-1];
            var number = Math.floor((Math.random() * 1000) + 20);

            var templateDyn    = '\
                                <div ng-show="!$ngModel$">\
                                  <input ng-if="!$ngModel$" autocomplete="off" tabindex="-1" class="uiSelectRequired ui-select-offscreen" style="top: inherit !important;margin-left: 85px !important;margin-top: 50px !important;" type=text ng-model="$ngModel$" $required$>\
                                  <div class="form-group upload-image-component" ngf-drop="" ngf-drag-over-class="dragover"> \
                                    <img class="ng-scope" style="height: 128px; width: 128px;" ng-if="!$ngModel$" data-ng-src="/plugins/cronapp-framework-js/img/selectFile.png" ngf-drop="" ngf-select="" ngf-change="cronapi.internal.uploadFile(\'$ngModel$\', $file, \'uploadprogress$number$\')" accept="*">\
                                    <progress id="uploadprogress$number$" max="100" value="0" style="position: absolute; width: 128px; margin-top: -134px;">0</progress>\
                                  </div>\
                                </div> \
                                <div ng-show="$ngModel$" class="form-group upload-image-component"> \
                                  <div class="btn btn-danger btn-xs ng-scope" style="float:right;" ng-if="$ngModel$" ng-click="$ngModel$=null"> \
                                    <span class="glyphicon glyphicon-remove"></span> \
                                  </div> \
                                  <div> \
                                    <div ng-bind-html="cronapi.internal.generatePreviewDescriptionByte($ngModel$)"></div> \
                                    <a href="javascript:void(0)" ng-click="cronapi.internal.downloadFileEntity($datasource$,\'$field$\')">download</a> \
                                  </div> \
                                </div> \
                                ';
            element.append(templateDyn
                .split('$ngModel$').join(s.ngModel)
                .split('$datasource$').join(datasource)
                .split('$field$').join(field)
                .split('$number$').join(number)
                .split('$required$').join(required)
            );
            $compile(element)(element.scope());
          }
        }
      })
      .directive('pwCheck', [function() {
        'use strict';
        return {
          require: 'ngModel',
          link: function(scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function() {
              scope.$apply(function() {
                var v = elem.val() === $(firstPassword).val();
                ctrl.$setValidity('pwmatch', v);
              });
            });
          }
        }
      }])
      .directive('ngClick', [function() {
        'use strict';
        return {
          link: function(scope, elem, attrs, ctrl) {
            if (scope.rowData) {
              var crnDatasource = elem.closest('[crn-datasource]')
              if (crnDatasource.length > 0) {
                elem.on('click', function() {
                  scope.$apply(function() {
                    var datasource = eval(crnDatasource.attr('crn-datasource'));
                    datasource.active = scope.rowData;
                  });
                });
              }
            }
          }
        }
      }])

      /**
       * Validação de campos CPF e CNPJ,
       * para utilizar essa diretiva, adicione o atributo valid com o valor
       * do tipo da validação (cpf ou cnpj). Exemplo <input type="text" valid="cpf">
       */
      .directive('valid', function() {
        return {
          require: '^ngModel',
          restrict: 'A',
          link: function(scope, element, attrs, ngModel) {
            var validator = {
              'cpf': CPF,
              'cnpj': CNPJ
            };

            ngModel.$validators[attrs.valid] = function(modelValue, viewValue) {
              var value = modelValue || viewValue;
              var fieldValid = validator[attrs.valid].isValid(value);
              if (!fieldValid) {
                element.scope().$applyAsync(function(){ element[0].setCustomValidity(element[0].dataset['errorMessage']); }) ;
              } else {
                element[0].setCustomValidity("");
              }
              return (fieldValid || !value);
            };
          }
        }
      })

      .directive('cronappSecurity', function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var roles = [];
            if (scope.session && scope.session.roles) {
              roles = scope.session.roles.toLowerCase().split(",");
            }

            var perms = parsePermission(attrs.cronappSecurity);
            var show = false;
            var enabled = false;
            for (var i=0;i<roles.length;i++) {
              var role = roles[i].trim();
              if (role) {
                if (perms.visible[role]) {
                  show = true;
                }
                if (perms.enabled[role]) {
                  enabled = true;
                }
              }
            }

            if (!show) {
              $(element).hide();
            }

            if (!enabled) {
              $(element).find('*').addBack().attr('disabled', true);
            }
          }
        }
      })
	  
	.directive('qr', ['$window', function($window){
    return {
      restrict: 'A',
      require: '^ngModel',
      template: '<canvas ng-hide="image"></canvas><img ng-if="image" ng-src="{{canvasImage}}"/>',
      link: function postlink(scope, element, attrs, ngModel){
        if (scope.size === undefined  && attrs.size) {
          scope.text = attrs.size;
        }
      var getTypeNumeber = function(){
      return scope.typeNumber || 0;
    };
    var getCorrection = function(){
      var levels = {
        'L': 1,
        'M': 0,
        'Q': 3,
        'H': 2
      };
    var correctionLevel = scope.correctionLevel || 0;
      return levels[correctionLevel] || 0;
    };
    var getText = function(){
      return ngModel.$modelValue || "";
    };
    var getSize = function(){
      return scope.size || $(element).outerWidth();
    };
    var isNUMBER = function(text){
      var ALLOWEDCHARS = /^[0-9]*$/;
      return ALLOWEDCHARS.test(text);
    };
    var isALPHA_NUM = function(text){
      var ALLOWEDCHARS = /^[0-9A-Z $%*+\-./:]*$/;
      return ALLOWEDCHARS.test(text);
    };
    var is8bit = function(text){
      for (var i = 0; i < text.length; i++) {
        var code = text.charCodeAt(i);
        if (code > 255) {
          return false;
        }
      }
      return true;
    };
    var checkInputMode = function(inputMode, text){
      if (inputMode === 'NUMBER' && !isNUMBER(text)) {
        throw new Error('The `NUMBER` input mode is invalid for text.');
      }
      else if (inputMode === 'ALPHA_NUM' && !isALPHA_NUM(text)) {
        throw new Error('The `ALPHA_NUM` input mode is invalid for text.');
      }
      else if (inputMode === '8bit' && !is8bit(text)) {
        throw new Error('The `8bit` input mode is invalid for text.');
      }
      else if (!is8bit(text)) {
        throw new Error('Input mode is invalid for text.');
      }
      return true;
    };
    var getInputMode = function(text){
      var inputMode = scope.inputMode;
      inputMode = inputMode || (isNUMBER(text) ? 'NUMBER' : undefined);
      inputMode = inputMode || (isALPHA_NUM(text) ? 'ALPHA_NUM' : undefined);
      inputMode = inputMode || (is8bit(text) ? '8bit' : '');
      return checkInputMode(inputMode, text) ? inputMode : '';
    };
    var canvas = element.find('canvas')[0];
    var canvas2D = !!$window.CanvasRenderingContext2D;
    scope.TYPE_NUMBER = getTypeNumeber();
    scope.TEXT = getText();
    scope.CORRECTION = getCorrection();
    scope.SIZE = getSize();
    scope.INPUT_MODE = getInputMode(scope.TEXT);
    scope.canvasImage = '';
    var draw = function(context, qr, modules, tile){
      for (var row = 0; row < modules; row++) {
        for (var col = 0; col < modules; col++) {
          var w = (Math.ceil((col + 1) * tile) - Math.floor(col * tile)),
              h = (Math.ceil((row + 1) * tile) - Math.floor(row * tile));
          context.fillStyle = qr.isDark(row, col) ? '#000' : '#fff';
          context.fillRect(Math.round(col * tile), Math.round(row * tile), w, h);
        }
      }
    };
    var render = function(canvas, value, typeNumber, correction, size, inputMode){
      var trim = /^\s+|\s+$/g;
      var text = value.replace(trim, '');
      var qr = new QRCode(typeNumber, correction, inputMode);
      qr.addData(text);
      qr.make();
      var context = canvas.getContext('2d');
      var modules = qr.getModuleCount();
      var tile = size / modules;
      canvas.width = canvas.height = size;
      if (canvas2D) {
        draw(context, qr, modules, tile);
        scope.canvasImage = canvas.toDataURL() || '';
      }
    };
    
    scope.$watch(function(){return ngModel.$modelValue}, function(value, old){
    if (value !== old) {
      scope.text = ngModel.$modelValue;
      scope.TEXT = getText();
      scope.INPUT_MODE = getInputMode(scope.TEXT);
      render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
    }
  });
    render(canvas, scope.TEXT, scope.TYPE_NUMBER, scope.CORRECTION, scope.SIZE, scope.INPUT_MODE);
    }};
  }])

      .directive('uiSelect', function ($compile) {
        return {
          restrict: 'E',
          require: 'ngModel',
          link: function (scope, element, attrs, ngModelCtrl) {
            if (attrs.required != undefined || attrs.ngRequired === "true") {
              $(element).append("<input autocomplete=\"off\" tabindex=\"-1\" class=\"uiSelectRequired ui-select-offscreen\" style=\"left: 50%!important; top: 100%!important;\" type=text ng-model=\""+attrs.ngModel+"\" required>");
              var input = $(element).find("input.uiSelectRequired");
              $compile(input)(element.scope());
            }
          }
        };
      })

      .filter('mask',function($translate) {
        return function(value, maskValue) {
          maskValue = parseMaskType(maskValue, $translate);
          if (!maskValue)
            return value;

          maskValue = maskValue.replace(';1', '').replace(';0', '').trim();

          if (typeof value == "string" && value.match(isoDate)) {
            return moment.utc(value).format(maskValue);
          } else if (value instanceof Date) {
            return moment.utc(value).format(maskValue);
          } else if (typeof value == 'number') {
            return format(maskValue, value);
          }  else if (value != undefined && value != null && value != "") {
            var input = $("<input type=\"text\">");
            input.mask(maskValue);
            return input.masked(value);
          } else {
            return value;
          }
        };
      })

      .directive('mask', maskDirectiveMask)

      .directive('cronappFilter', function($compile) {
        return {
          restrict: 'A',
          require: '?ngModel',
          setFilterInButton: function($element, bindedFilter, operator) {
            var fieldset = $element.closest('fieldset');
            if (!fieldset)
              return;
            var button = fieldset.find('button[cronapp-filter]');
            if (!button)
              return;

            var filters = button.data('filters');
            if (!filters)
              filters = [];

            var index = -1;
            var ngModel = $element.attr('ng-model');
            $(filters).each(function(idx) {
              if (this.ngModel == ngModel)
                index = idx;
            });

            if (index > -1)
              filters.splice(index, 1);

            if (bindedFilter.length > 0) {
              var bindedFilterJson = {
                "ngModel" : ngModel,
                "bindedFilter" : bindedFilter
              };
              filters.push(bindedFilterJson);
            }
            button.data('filters', filters);
          },
          makeAutoPostSearch: function($element, bindedFilter, datasource, attrs) {
            var fieldset = $element.closest('fieldset');
            if (fieldset && fieldset.length > 0) {
              var button = fieldset.find('button[cronapp-filter]');
              if (button && button.length > 0) {
                var filters = button.data('filters');
                if (filters && filters.length > 0) {
                  bindedFilter = '';
                  $(filters).each(function() {
                    bindedFilter += this.bindedFilter+";";
                  });
                }
              }
            }
            datasource.search(bindedFilter, (attrs.cronappFilterCaseinsensitive=="true"));
          },
          inputBehavior: function(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost) {
            var filterTemplate = '';
            var filtersSplited = attrs.cronappFilter.split(';');
            $(filtersSplited).each(function() {
              if (this.length > 0) {
                //Se for do tipo text passa parametro como like
                if (typeElement == 'text')
                  filterTemplate += this + '@' + operator + '%{value}%;';
                //Senão passa parametro como valor exato
                else
                  filterTemplate += this + operator + '{value};';
              }
            });
            if (filterTemplate.length > 0)
              filterTemplate = filterTemplate.substr(0, filterTemplate.length-1);
            else
              filterTemplate = '%{value}%';

            var selfDirective = this;
            if (ngModelCtrl) {
              scope.$watch(attrs.ngModel, function(newVal, oldVal) {
                if (angular.equals(newVal, oldVal)) { return; }
                var eType = $element.data('type') || $element.attr('type');
                var value = ngModelCtrl.$modelValue;
                var datasource = eval(attrs.crnDatasource);

                if (value instanceof Date) {
                  value = value.toISOString();
                  if (eType == "date") {
                    value = value + "@@date";
                  }
                  else if (eType == "time" || eType == "time-local") {
                    value = value + "@@time";
                  }
                  else {
                    value = value + "@@datetime";
                  }
                }

                else if (typeof value == "number") {
                  value = value + "@@number";
                }

                else if (typeof value == "boolean") {
                  value = value + "@@boolean";
                }

                var bindedFilter = filterTemplate.split('{value}').join(value);
                if (ngModelCtrl.$viewValue.length == 0)
                  bindedFilter = '';

                selfDirective.setFilterInButton($element, bindedFilter, operator);
                if (autopost)
                  selfDirective.makeAutoPostSearch($element, bindedFilter, datasource, attrs);

              });
            }
            else {
              if (typeElement == 'text') {
                $element.on("keyup", function() {
                  var datasource = eval(attrs.crnDatasource);
                  var value = undefined;
                  if (ngModelCtrl && ngModelCtrl != undefined)
                    value = ngModelCtrl.$viewValue;
                  else
                    value = this.value;
                  var bindedFilter = filterTemplate.split('{value}').join(value);
                  if (this.value.length == 0)
                    bindedFilter = '';

                  selfDirective.setFilterInButton($element, bindedFilter, operator);
                  if (autopost)
                    selfDirective.makeAutoPostSearch($element, bindedFilter, datasource, attrs);
                });
              }
              else {
                $element.on("change", function() {
                  var datasource = eval(attrs.crnDatasource);
                  var value = undefined;
                  var typeElement = $(this).attr('type');
                  if (attrs.asDate != undefined)
                    typeElement = 'date';

                  if (ngModelCtrl && ngModelCtrl != undefined) {
                    value = ngModelCtrl.$viewValue;
                  }
                  else {
                    if (typeElement == 'checkbox')
                      value = $(this).is(':checked');
                    else if (typeElement == 'date') {
                      value = this.value;
                      if (this.value.length > 0) {
                        var momentDate = moment(this.value, patternFormat(this));
                        value = momentDate.toDate().toISOString();
                      }
                    }
                    else
                      value = this.value;
                  }
                  var bindedFilter = filterTemplate.split('{value}').join(value);
                  if (value.toString().length == 0)
                    bindedFilter = '';

                  selfDirective.setFilterInButton($element, bindedFilter, operator);
                  if (autopost)
                    selfDirective.makeAutoPostSearch($element, bindedFilter, datasource, attrs);
                });
              }
            }
          },
          forceDisableDatasource: function(datasourceName, scope) {
            var disableDatasource = setInterval(function() {
              try {
                var datasourceInstance = eval(datasourceName);
                if (datasourceInstance) {
                  $(document).ready(function() {
                    var time = 0;
                    var intervalForceDisable = setInterval(function() {
                      if (time < 10) {
                        scope.$apply(function () {
                          datasourceInstance.enabled = false;
                          datasourceInstance.data = [];  
                        });
                        time++;
                      }
                      else
                        clearInterval(intervalForceDisable);
                    }, 20);
                  });
                  clearInterval(disableDatasource);
                }
              }
              catch(e) {
                //try again, until render
              }
            },10);
          },
          buttonBehavior: function(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost) {
            var datasourceName = '';
            if (attrs.crnDatasource)
              datasourceName = attrs.crnDatasource;
            else
              datasourceName = $element.parent().attr('crn-datasource')
            debugger;
            var requiredFilter = attrs.requiredFilter && attrs.requiredFilter.toString() == "true";
            if (requiredFilter) {
              this.forceDisableDatasource(datasourceName, scope);
              // var $datasource = $('datasource[name="'+datasourceName+'"]');
              // $datasource.attr('enabled','false');
              // var x = angular.element($datasource);
              // $compile(x)(scope);
            }
            
            $element.on('click', function() {
              var $this = $(this);
              var filters = $this.data('filters');
              if (datasourceName && datasourceName.length > 0 && filters) {
                var bindedFilter = '';
                $(filters).each(function() {
                  bindedFilter += this.bindedFilter+";";
                });

                var datasourceToFilter = eval(datasourceName);
                
                if (requiredFilter) {
                  datasourceToFilter.enabled = bindedFilter.length > 0;
                  if (datasourceToFilter.enabled) {
                    datasourceToFilter.search(bindedFilter, (attrs.cronappFilterCaseinsensitive=="true"));
                  }
                  else {
                    scope.$apply(function () {
                      datasourceToFilter.data = [];
                    });
                  }
                }
                else
                  datasourceToFilter.search(bindedFilter, (attrs.cronappFilterCaseinsensitive=="true"));
              }
            });
          },
          link: function(scope, element, attrs, ngModelCtrl) {
            var $element = $(element);
            var typeElement = $element.data('type') || $element.attr('type');
            if (attrs.asDate != undefined)
              typeElement = 'date';

            var operator = '=';
            if (attrs.cronappFilterOperator && attrs.cronappFilterOperator.length > 0)
              operator = attrs.cronappFilterOperator;

            var autopost = true;
            if (attrs.cronappFilterAutopost && attrs.cronappFilterAutopost == "false")
              autopost = false;

            if ($element[0].tagName == "INPUT")
              this.inputBehavior(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost);
            else
              this.buttonBehavior(scope, element, attrs, ngModelCtrl, $element, typeElement, operator, autopost);
          }
        }
      })
      .directive('cronRichEditor', function ($compile) {
        return {
          restrict: 'E',
          replace: true,
          require: 'ngModel',
          parseToTinyMCEOptions: function(optionsSelected) {

            var toolbarGroup = {};
            toolbarGroup["allowFullScreen"] = "fullscreen |";
            toolbarGroup["allowPage"] = "fullpage newdocument code pagebreak |";
            toolbarGroup["allowPrint"] = "preview print |";
            toolbarGroup["allowTransferArea"] = "cut copy paste |";
            toolbarGroup["allowDoUndo"] = "undo redo |";
            toolbarGroup["allowSymbol"] = "charmap |";
            toolbarGroup["allowEmbeddedImage"] = "bdesk_photo |";
            toolbarGroup["allowFont"] = "formatselect fontselect fontsizeselect strikethrough bold italic underline removeformat |";
            toolbarGroup["allowLinks"] = "link unlink anchor |";
            toolbarGroup["allowParagraph"] = "alignleft aligncenter alignright alignjustify numlist bullist outdent indent blockquote hr |";
            toolbarGroup["allowFormulas"] = "tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry tiny_mce_wiris_CAS |";


            var tinyMCEOptions = {
              menubar: false,
              statusbar: false,
              plugins: "bdesk_photo advlist anchor autolink autoresize autosave charmap code colorpicker contextmenu directionality emoticons fullpage fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template toc visualblocks visualchars wordcount tiny_mce_wiris",
              toolbar: "",
              content_style: ""
            };

            for (var key in optionsSelected) {
              if (key.startsWith("allow")) {
                if (optionsSelected[key])
                  tinyMCEOptions.toolbar += " " + toolbarGroup[key];
              }
            }
            tinyMCEOptions.menubar = optionsSelected.showMenuBar;
            tinyMCEOptions.statusbar = optionsSelected.showStatusBar;
            tinyMCEOptions.content_style = optionsSelected.contentStyle;

            return JSON.stringify(tinyMCEOptions);
          },
          link: function (scope, element, attrs, ngModelCtrl) {

            var optionsSelected = JSON.parse(attrs.options);
            var tinyMCEOptions = this.parseToTinyMCEOptions(optionsSelected);

            var templateDyn    = '\
                  <textarea \
                    ui-tinymce="$options$" \
                    ng-model="$ngModel$"> \
                  </textarea> \
                ';
            templateDyn = $(templateDyn
                .split('$ngModel$').join(attrs.ngModel)
                .split('$options$').join(escape(tinyMCEOptions))
            );

            var x = angular.element(templateDyn);
            element.html('');
            element.append(x);
            $compile(x)(scope);
          }
        };
      })
      .directive('cronGrid', ['$compile', '$translate', function($compile, $translate) {
        return {
          restrict: 'E',
          replace: true,
          require: 'ngModel',
          generateId: function() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
          },
          generateBlocklyCall: function(blocklyInfo) {
            var call;
            if (blocklyInfo.type == "client")  {
              var splitedClass = blocklyInfo.blocklyClass.split('/');
              var blocklyName = splitedClass[splitedClass.length-1];
              call = "blockly.js.blockly." + blocklyName;
              call += "." +  blocklyInfo.blocklyMethod;
              var params = "()";
              if (blocklyInfo.blocklyParams.length > 0) {
                params = "(";
                blocklyInfo.blocklyParams.forEach(function(p) {
                  params += this.encodeHTML(p.value) + ",";
                }.bind(this))
                params = params.substr(0, params.length - 1);
                params += ")";
              }
              call += params;
            }
            else if (blocklyInfo.type == "server") {
              var blocklyName = blocklyInfo.blocklyClass + ':' + blocklyInfo.blocklyMethod;
              call = "cronapi.util.makeCallServerBlocklyAsync('"+blocklyName+"',null,null,";
              if (blocklyInfo.blocklyParams.length > 0) {
                blocklyInfo.blocklyParams.forEach(function(p) {
                  call += this.encodeHTML(p.value) + ",";
                }.bind(this))
              }
              call = call.substr(0, call.length - 1);
              call += ")";
            }
            return call;

          },
          generateToolbarButtonBlockly: function(toolbarButton, scope) {
            var buttonBlockly;

            var generateObjTemplate = function(functionToCall, title) {
              var obj = {
                template: function() {
                  var buttonId = this.generateId();
                  return compileTemplateAngular(buttonId, functionToCall, title);
                }.bind(this)
              };
              return obj;
            }.bind(this);

            var compileTemplateAngular = function(buttonId, functionToCall, title) {
              var template = '<a class="k-button" id="#BUTTONID#" href="javascript:void(0)" ng-click="#FUNCTIONCALL#">#TITLE#</a>';
              template = template
              .split('#BUTTONID#').join(buttonId)
              .split('#FUNCTIONCALL#').join(functionToCall)
              .split('#TITLE#').join(title);

              var waitRender = setInterval(function() {
                if ($('#' + buttonId).length > 0) {
                  var x = angular.element($('#' + buttonId ));
                  $compile(x)(scope);
                  clearInterval(waitRender);
                }
              },200);

              return template;
            };

            var call = this.generateBlocklyCall(toolbarButton.blocklyInfo);
            buttonBlockly = generateObjTemplate(call, toolbarButton.title);
            return buttonBlockly;
          },
          getObjectId: function(obj) {
            if (!obj)
              obj = "";
            if (typeof obj === 'object') {
              //Verifica se tem id, senão pega o primeiro campo
              if (obj["id"])
                obj = obj["id"];
              else {
                for (var key in obj) {
                  obj = obj[key];
                  break;
                }
              }
            }
            return obj;
          },
          updateFiltersFromAngular: function(grid, scope) {

            grid.dataSource.options.filter.forEach(function(f) {
              if ("screen" == f.linkParentType) {
                scope.$watch(f.linkParentField, function(newValue, oldValue) {
                  grid.dataSource.options.filter.forEach(function(filterToUpdate) {
                    if ("screen" == f.linkParentType && f.linkParentField == filterToUpdate.linkParentField) {
                      newValue = this.getObjectId(newValue);
                      filterToUpdate.value = newValue;
                    }
                  }.bind(this));
                  grid.dataSource.read();
                  grid.refresh();
                  grid.trigger('change');
                }.bind(this));
              }
            }.bind(this));
          },
          setFiltersFromLinkColumns: function(datasource, options, scope) {
            datasource.filter = [];
            options.columns.forEach( function(c) {
              if (c.linkParentField && c.linkParentField.length > 0 &&
                  c.linkParentType && c.linkParentType.length > 0)
              {
                var filter = { field: c.field, operator: "eq", value: "", linkParentField: c.linkParentField, linkParentType: c.linkParentType };
                if (filter.linkParentType == "screen") {
                  var value = scope[filter.linkParentField];
                  value = this.getObjectId(value);
                  filter.value = value;
                }
                datasource.filter.push(filter);
              }
            }.bind(this));
          },
          // updateNgModel
          encodeHTML: function(value){
            return value.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
          },
          decodeHTML: function(value){
            return value.replace(/&apos;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&gt;/g, '>')
            .replace(/&lt;/g, '<')
            .replace(/&amp;/g, '&');
          },
          getColumns: function(options, scope) {

            function categoryDropDownEditor(container, options) {
              debugger;
              $('<input required name="' + options.field + '"/>')
              .appendTo(container)
              .kendoDropDownList({
                autoBind: false,
                dataTextField: "CategoryName",
                dataValueField: "CategoryID",
                dataSource: {
                  type: "odata",
                  transport: {
                    read: "https://demos.telerik.com/kendo-ui/service/Northwind.svc/Categories"
                  }
                }
              });
            }


            var columns = [];
            if (options.columns) {
              options.columns.forEach(function(column)  {
                if (column.visible) {
                  if (column.dataType == "Database") {

                    var addColumn = {
                      field: column.field,
                      title: column.headerText,
                      type: column.type,
                      width: column.width,
                      sortable: column.sortable,
                      filterable: column.filterable,
                      // editor: categoryDropDownEditor
                    };
                    if (column.format)
                      addColumn.format = column.format;
                    columns.push(addColumn);

                  }
                  else if (column.dataType == "Command") {
                    //Se não for editavel, não adiciona colunas de comando
                    if (options.editable != 'no') {
                      var command = column.command.split('|');
                      var addColumn = {
                        command: command,
                        title: column.headerText,
                        width: column.width
                      };
                      columns.push(addColumn);
                    }
                  }
                  else if (column.dataType == "Blockly") {
                    var directiveContext = this;
                    var addColumn = {
                      command: [{
                        name: this.generateId(),
                        text: column.headerText,
                        click: function(e) {
                          debugger;
                          e.preventDefault();
                          var tr = $(e.target).closest("tr"); // get the current table row (tr)
                          var grid = tr.closest('table');

                          var item = this.dataItem(tr);
                          // var index = $(grid).find('tr.'+$(tr).attr('class')).index(tr);
                          var index = $(grid.find('tbody')[0]).children().index(tr)
                          var consolidated = {
                            item: item,
                            index: index
                          }
                          var call = 'scope.' + directiveContext.generateBlocklyCall(column.blocklyInfo);
                          eval(call);
                          return;
                        }
                      }],
                      width: column.width
                    };
                    columns.push(addColumn);
                  }

                }
              }.bind(this));
            }

            return columns;
          },
          getPageAble: function(options) {
            var pageable = {
              refresh:  options.allowRefreshGrid,
              pageSizes: options.allowSelectionTotalPageToShow,
              buttonCount: 5
            };

            if (!options.allowPaging)
              pageable = options.allowPaging;

            return pageable;
          },
          getToolbar: function(options, scope) {
            var toolbar = [];

            options.toolBarButtons.forEach(function(toolbarButton) {
              if (toolbarButton.type == "Native") {
                //Se a grade for editavel, adiciona todos os commands
                if (options.editable != 'no') {
                  if (toolbarButton.title == "save" || toolbarButton.title == "cancel") {
                    //O Salvar e cancelar na toolbar só é possível no batch mode
                    if (options.editable == 'batch')
                      toolbar.push(toolbarButton.title);
                  }
                  else
                    toolbar.push(toolbarButton.title);
                }
                //Senão, adiciona somente commands que não sejam de crud
                else {
                  if (toolbarButton.title == "pdf" || toolbarButton.title == "excel") {
                    toolbar.push(toolbarButton.title);
                  }
                }
              }
              else if (toolbarButton.type == "Blockly") {
                var buttonBlockly = this.generateToolbarButtonBlockly(toolbarButton, scope);
                toolbar.push(buttonBlockly);
              }
              else if (toolbarButton.type == "Template") {
                var buttonTemplate =  {
                  template: toolbarButton.template
                }
                toolbar.push(buttonTemplate);
              }

            }.bind(this));

            if (toolbar.length == 0)
              toolbar = undefined;
            return toolbar;
          },
          getEditable: function(options) {

            var editable = options.editable;
            if (options.editable == 'batch') {
              editable = true;
            }
            else if (options.editable == 'no') {
              editable = false;
            }
            return editable;
          },
          generateKendoGridInit: function(options, scope) {

            var helperDirective = this;
            function detailInit(e) {
              e.sender.options.listCurrentOptions.forEach(function(currentOptions) {
                var currentKendoGridInit = helperDirective.generateKendoGridInit(currentOptions, scope);

                currentKendoGridInit.dataSource.filter.forEach(function(f) {
                  if (f.linkParentType == "hierarchy" ) {
                    f.value = e.data[f.linkParentField];
                  }
                });

                var grid = $("<div/>").appendTo(e.detailCell).kendoGrid(currentKendoGridInit).data('kendoGrid');
                grid.dataSource.transport.options.grid = grid;
                helperDirective.updateFiltersFromAngular(grid, scope);

              });
            }

            var datasource = app.kendoHelper.getDataSource(options.dataSource, options.allowPaging, options.pageCount);
            var columns = this.getColumns(options, scope);
            var pageAble = this.getPageAble(options);
            var toolbar = this.getToolbar(options, scope);
            var editable = this.getEditable(options);
            //Adiciona os campos de ligação (Filtro do datasource)
            this.setFiltersFromLinkColumns(datasource, options, scope);

            var kendoGridInit = {
              toolbar: toolbar,
              pdf: {
                allPages: true,
                avoidLinks: true,
                paperSize: "A4",
                margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                landscape: true,
                repeatHeaders: true,
                scale: 0.8
              },
              dataSource: datasource,
              editable: editable,
              height: options.height,
              groupable: options.allowGrouping,
              sortable: options.allowSorting,
              filterable: true,
              pageable: pageAble,
              columns: columns,
              selectable: options.allowSelectionRow,
              detailInit: (options.details && options.details.length > 0) ? detailInit : undefined,
              listCurrentOptions: (options.details && options.details.length > 0) ? options.details : undefined
            };

            return kendoGridInit;

          },
          link: function (scope, element, attrs, ngModelCtrl) {
            var $templateDyn = $('<div></div>');
            var baseUrl = 'plugins/cronapp-framework-js/dist/js/kendo-ui/js/messages/kendo.messages.';
            if ($translate.use() == 'pt_br')
              baseUrl += "pt-BR.min.js";
            else
              baseUrl += "en-US.min.js";

            var helperDirective = this;

            $.getScript(baseUrl, function () {
              console.log('loaded language');

              var options = JSON.parse(attrs.options || "{}");
              var kendoGridInit = helperDirective.generateKendoGridInit(options, scope);

              kendoGridInit.change = function(e) {
                var item = this.dataItem(this.select());
                var fcChangeValue = eval('scope.cronapi.screen.changeValueOfField')
                fcChangeValue(attrs['ngModel'], item);
              }


              var grid = $templateDyn.kendoGrid(kendoGridInit).data('kendoGrid');
              grid.dataSource.transport.options.grid = grid;
              helperDirective.updateFiltersFromAngular(grid, scope);

            });

            element.html($templateDyn);
            $compile($templateDyn)(element.scope());

          }
        };
      }])
}(app));

function maskDirectiveAsDate($compile, $translate) {
  return maskDirective($compile, $translate, 'as-date');
}

function maskDirectiveMask($compile, $translate) {
  return maskDirective($compile, $translate, 'mask');
}

function maskDirective($compile, $translate, attrName) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModelCtrl) {
      if(attrName == 'as-date' && attrs.mask !== undefined)
        return;


      var $element = $(element);

      var type = $element.attr("type");

      if (type == "checkbox" || type == "password")
        return;

      $element.data("type", type);

      $element.attr("type", "text");

      if (ngModelCtrl) {
        ngModelCtrl.$formatters = [];
        ngModelCtrl.$parsers = [];
      }

      if (attrs.asDate !== undefined && type == 'text')
        type = "date";

      var textMask = true;

      var removeMask = false;

      var attrMask = attrs.mask || attrs.format;

      if (!attrMask) {
        attrMask = parseMaskType(type, $translate);
      } else {
        attrMask = parseMaskType(attrMask, $translate);
      }

      if (attrMask.endsWith(";0")) {
        removeMask = true;
      }

      var mask = attrMask.replace(';1', '').replace(';0', '').trim();
      if (mask == undefined || mask.length == 0) {
        return;
      }

      if (type == 'date' || type == 'datetime' || type == 'datetime-local' || type == 'month' || type == 'time' || type == 'time-local' || type == 'week') {

        var options = {
          format: mask,
          locale: $translate.use(),
          showTodayButton: true,
          useStrict: true,
          tooltips: {
            today: $translate.instant('DatePicker.today'),
            clear: $translate.instant('DatePicker.clear'),
            close: $translate.instant('DatePicker.close'),
            selectMonth: $translate.instant('DatePicker.selectMonth'),
            prevMonth: $translate.instant('DatePicker.prevMonth'),
            nextMonth: $translate.instant('DatePicker.nextMonth'),
            selectYear: $translate.instant('DatePicker.selectYear'),
            prevYear: $translate.instant('DatePicker.prevYear'),
            nextYear: $translate.instant('DatePicker.nextYear'),
            selectDecade: $translate.instant('DatePicker.selectDecade'),
            prevDecade: $translate.instant('DatePicker.prevDecade'),
            nextDecade: $translate.instant('DatePicker.nextDecade'),
            prevCentury: $translate.instant('DatePicker.prevCentury'),
            nextCentury: $translate.instant('DatePicker.nextCentury')
          }
        };

        if (mask != 'DD/MM/YYYY' && mask != 'MM/DD/YYYY') {
          options.sideBySide = true;
        }

        $element.wrap("<div style=\"position:relative\"></div>")
        $element.datetimepicker(options);

        var useUTC = type == 'date' || type == 'datetime' || type == 'time';

        $element.on('dp.change', function () {
          if ($(this).is(":visible")) {
            $(this).trigger('change');
            scope.$apply(function () {
              var value = $element.val();
              var momentDate = null;
              if (useUTC) {
                momentDate = moment.utc(value, mask);
              } else {
                momentDate = moment(value, mask);
              }
              if (momentDate.isValid() && ngModelCtrl)
                ngModelCtrl.$setViewValue(momentDate.toDate());
            });
          }
        });

        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value) {
              var momentDate = null;

              if (useUTC) {
                momentDate = moment.utc(value);
              } else {
                momentDate = moment(value);
              }

              return momentDate.format(mask);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              var momentDate = null;
              if (useUTC) {
                momentDate = moment.utc(value, mask);
              } else {
                momentDate = moment(value, mask);
              }
              return momentDate.toDate();
            }

            return null;
          });
        }

      } else if (type == 'number' || type == 'money' || type == 'integer') {
        removeMask = true;
        textMask = false;

        var currency = mask.trim().replace(/\./g, '').replace(/\,/g, '').replace(/#/g, '').replace(/0/g, '').replace(/9/g, '');

        var prefix = '';
        var suffix = '';
        var thousands = '';
        var decimal = ',';
        var precision = 0;

        if (mask.startsWith(currency)) {
          prefix = currency;
        }

        else if (mask.endsWith(currency)) {
          suffix = currency;
        }

        var pureMask = mask.trim().replace(prefix, '').replace(suffix, '').trim();

        if (pureMask.startsWith("#.")) {
          thousands = '.';
        }
        else if (pureMask.startsWith("#,")) {
          thousands = ',';
        }

        var dMask = null;

        if (pureMask.indexOf(",0") != -1) {
          decimal = ',';
          dMask = ",0";
        }
        else if (pureMask.indexOf(".0") != -1) {
          decimal = '.';
          dMask = ".0";
        }

        if (dMask != null) {
          var strD = pureMask.substring(pureMask.indexOf(dMask) + 1);
          precision = strD.length;
        }


        var inputmaskType = 'numeric';

        if (precision == 0)
          inputmaskType = 'integer';

        var ipOptions = {
          'rightAlign':  (type == 'money'),
          'unmaskAsNumber': true,
          'allowMinus': true,
          'prefix': prefix,
          'suffix': suffix,
          'radixPoint': decimal,
          'digits': precision
        };

        if (thousands) {
          ipOptions['autoGroup'] = true;
          ipOptions['groupSeparator'] = thousands;
        }

        $(element).inputmask(inputmaskType, ipOptions);

        if (ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value != undefined && value != null && value != '') {
              return format(mask, value);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value != undefined && value != null && value != '') {
              var unmaskedvalue = $element.inputmask('unmaskedvalue');
              if (unmaskedvalue != '')
                return unmaskedvalue;
            }

            return null;
          });
        }

      }

      else if (type == 'text' || type == 'tel') {

        var options = {};
        if (attrs.maskPlaceholder) {
          options.placeholder = attrs.maskPlaceholder
        }

        $element.mask(mask, options);

        if (removeMask && ngModelCtrl) {
          ngModelCtrl.$formatters.push(function (value) {
            if (value) {
              return $element.masked(value);
            }

            return null;
          });

          ngModelCtrl.$parsers.push(function (value) {
            if (value) {
              return $element.cleanVal();
            }

            return null;
          });
        }
      }
    }
  }
}

function parseMaskType(type, $translate) {
  if (type == "datetime" || type == "datetime-local") {
    type = $translate.instant('Format.DateTime');
    if (type == 'Format.DateTime')
      type = 'DD/MM/YYYY HH:mm:ss'
  }

  else if (type == "date") {
    type = $translate.instant('Format.Date');
    if (type == 'Format.Date')
      type = 'DD/MM/YYYY'
  }

  else if (type == "time" || type == "time-local") {
    type = $translate.instant('Format.Hour');
    if (type == 'Format.Hour')
      type = 'HH:mm:ss'
  }

  else if (type == "month") {
    type = 'MMMM';
  }

  else if (type == "number") {
    type = $translate.instant('Format.Decimal');
    if (type == 'Format.Decimal')
      type = '0,00'
  }

  else if (type == "money") {
    type = $translate.instant('Format.Money');
    if (type == 'Format.Money')
      type = '#.#00,00'
  }

  else if (type == "integer") {
    type = '0';
  }

  else if (type == "week") {
    type = 'dddd';
  }

  else if (type == "tel") {
    type = '(00) 00000-0000;0';
  }

  else if (type == "text") {
    type = '';
  }

  return type;
}