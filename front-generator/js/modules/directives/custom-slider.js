/**=========================================================
 * Module: masked,js
 * Initializes the jQuery UI slider controls
 =========================================================*/

App.directive('customSlider', function($compile) {
  return {
    restrict: 'E',
    scope: {
      sliderId: '@',
      sliderMin: '@',
      sliderMax: '@',
      sliderStep: '@',
      sliderValue: '@',
      sliderOrientation: '@',
      desc: '@',
      type: '@'
    },
    link: function(scope, element, attrs) {
      var html = '<input type="text" id="'+attrs.sliderId+'" data-slider-min="'+attrs.sliderMin+'" data-slider-max="'+attrs.sliderMax+'" data-slider-step="'+attrs.sliderStep+'" data-slider-value="'+attrs.sliderValue+'" data-slider-orientation="'+attrs.sliderOrientation+'" />';
      var el = $compile(html)(scope);
      element.append(el);
      var ruleSlider = $('#'+attrs.sliderId).bootstrapSlider({tooltip: "hide"}).on('slideStop', checkV);
      var ruleSliderSlide = $('#'+attrs.sliderId).bootstrapSlider({tooltip: "hide"}).on('slide', checkVS);
      var desc = attrs.desc;
      checkV();
      function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      function checkV() {
        var fetch_slider_id = attrs.sliderId;
        var fetch_slider_id_s = fetch_slider_id.split('_');
        var val = ruleSlider.bootstrapSlider('getValue');
        var htm = '';
        if(attrs.type == 'range') {
          var des = JSON.parse(desc);
          var desR = '';
          if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.eq.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) < parseInt(attrs.sliderMax)) {
            desR = des.eqgt.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) > parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.lweq.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) > parseInt(attrs.sliderMin) && parseInt(val[1]) < parseInt(attrs.sliderMax)) {
            desR = des.lwgt.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.max.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.min.replace('%f', numberWithCommas(val[0]));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          }
          
          htm = desR;//test it
        } else if(attrs.type != 'selection' && attrs.type != 'range'){
          var des = desc;
          try {
            var par = JSON.parse(des);
            if(parseInt(val) == 0) {
              htm = par.min.replace('%s', numberWithCommas(val));
            } else if(val > 0 && val < attrs.sliderMax) {
              if(typeof par.med === 'object') {
                if(parseInt(val) == 1) {
                  htm = par.med.single.replace('%s', numberWithCommas(val));
                } else {
                  htm = par.med.plural.replace('%s', numberWithCommas(val));
                }
              } else {
                htm = par.med.replace('%s', numberWithCommas(val));
              }
            } else {
              htm = par.max.replace('%s', numberWithCommas(val));
            }
          } catch (e) {
            htm = des.replace('%s', numberWithCommas(val));
          }
        }
        $('#lbl_'+fetch_slider_id_s[1]).html(htm);
        scope.$parent.setSliderData(fetch_slider_id_s[1], val, htm);
      }

      function checkVS() {
        var fetch_slider_id = attrs.sliderId;
        var fetch_slider_id_s = fetch_slider_id.split('_');
        var val = ruleSliderSlide.bootstrapSlider('getValue');
        var htm = '';
        if(attrs.type == 'range') {
          var des = JSON.parse(desc);
          var desR = '';
          if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.eq.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) < parseInt(attrs.sliderMax)) {
            desR = des.eqgt.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) > parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.lweq.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) > parseInt(attrs.sliderMin) && parseInt(val[1]) < parseInt(attrs.sliderMax)) {
            desR = des.lwgt.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.max.replace('%f', numberWithCommas(parseInt(val[0])));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          } else if(parseInt(val[0]) == parseInt(attrs.sliderMin) && parseInt(val[1]) == parseInt(attrs.sliderMax)) {
            desR = des.min.replace('%f', numberWithCommas(val[0]));
            desR = desR.replace('%s', numberWithCommas(parseInt(val[1])));
          }
          htm = desR;//test it
        } else if(attrs.type != 'selection' && attrs.type != 'range'){
          var des = desc;
          try {
            var par = JSON.parse(des);
            if(parseInt(val) == 0) {
              htm = par.min.replace('%s', numberWithCommas(val));
            } else if(val > 0 && val < attrs.sliderMax) {
              if(typeof par.med === 'object') {
                if(parseInt(val) == 1) {
                  htm = par.med.single.replace('%s', numberWithCommas(val));
                } else {
                  htm = par.med.plural.replace('%s', numberWithCommas(val));
                }
              } else {
                htm = par.med.replace('%s', numberWithCommas(val));
              }
            } else {
              htm = par.max.replace('%s', numberWithCommas(val));
            }
          } catch (e) {
            htm = des.replace('%s', numberWithCommas(val));
          }
        }
        
        $('#lbl_'+fetch_slider_id_s[1]).html(htm);
        
        scope.$parent.setSliderData(fetch_slider_id_s[1], val);
      }
    },
    
    replace: true
  };
});
