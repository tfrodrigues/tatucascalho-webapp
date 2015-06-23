var UI_UTILS = {};

/**
 * Função responsável por criar uma label baseado em um elemento
 * da DOM, que deve possuir o atributo data-label. Caso o atributo
 * data-label não seja encontrado, a label não será criada. Caso
 * o elemento possua um ID, será usado como valor do atributo "for"
 * da label criada.
 *
 * @name createLabel
 * @param $obj
 */
UI_UTILS.createLabel = function($obj) {
  var labelMsg = $obj.data('label'),
    id = $obj.attr('id'),
    required = $obj.data('required'),
    label;

  //Cria a label apenas quando o componente possui o atributo data-label
  if (labelMsg !== undefined) {
    label = document.createElement('label');
    if (id) {
      label.setAttribute('for', $obj.attr('id'));
    }
    //Insere um espaço como label, esta não tenha sido encontrada
    //(para garantir que o tamanho do componente continue o mesmo em todos os inputs)
    label.innerHTML = (labelMsg || '&nbsp;');
  }

  if (required) {
    appendRequiredFieldIndicatorTo(label);
  }
  $obj.before(label);
  return label;
};

UI_UTILS.setFocusOnFirstValidElement = function(selectors, parent) {
  selectors = selectors || [
    'input[type="text"]',
    'input[type="password"]',
    'input[type="radio"]',
    'input[type="checkbox"]',
    'select',
    'textarea'
  ];
  var $parent = $(parent || '#content');
  var $field = $parent.find(selectors.toString()).not('[disabled], .disabled').first();
  if ($field.hasClass('chzn-done')) {
    $field = $field.next('.chzn-container').find('a, input.default');
  }
  $field.focus();
};

UI_UTILS.startSpin = function($obj, opts) {
  var spinner = new Spinner(opts || UI_UTILS.defaults.spinnerOpts);
  $obj.data('spinner', spinner);
  spinner.spin($obj[0]);
};

UI_UTILS.stopSpin = function($obj) {
  var spinner = $obj.data('spinner');
  spinner.stop();
};

UI_UTILS.getPropertyValue = function(obj, property) {
  var arr = property.split(".");
  while (arr.length && (obj = obj[arr.shift()]));
  return obj;
};

UI_UTILS.defaults = {
  spinnerOpts: {
    lines: 11,
    color: '#fff',
    length: 0,
    width: 6,
    radius: 9,
    rotate: 0,
    trail: 89,
    speed: 1.4
  }
};

function appendRequiredFieldIndicatorTo(element) {
  var hasRequiredIndicator = element.querySelector('span.required');
  if (!hasRequiredIndicator) {
    var requiredFieldIndicator = document.createElement("span");
    requiredFieldIndicator.setAttribute("class", "required");
    requiredFieldIndicator.innerHTML = '*';
    element.appendChild(requiredFieldIndicator);
  }
}
