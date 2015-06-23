  /* CLASS
   * ====================== */
  var Box = function(element, options){
    this.$element = $(element);
    this.content = document.createDocumentFragment();
    this.init();
  };
    
  Box.prototype.init = function(){
    this.extractContent();
    this.createBoxHeader();
    this.createBoxContent();
  };

  /**
  * Armazena o conteudo da box dentro de um fragmento.
  */
  Box.prototype.extractContent = function(){
    while(this.$element[0].firstChild){
      this.content.appendChild(this.$element[0].firstChild);
    }
  };

  Box.prototype.createBoxHeader = function(){
    var headerDiv = document.createElement('div')
    , h2Title = document.createElement('h2')
    , icon = document.createElement('i')
    , titleHolder = document.createElement('span')
    , spacer = document.createElement('span')
    , iconValue = this.$element.data('icon')
    , labelValue = this.$element.data('label')
    ;

    headerDiv.setAttribute('class', 'box-header');

    //Caso possua icone, adiciona o icone um "spacer" na box
    icon.setAttribute('class', 'ui-box-icon ' + iconValue);
    spacer.setAttribute('class', 'break');
    h2Title.appendChild(icon);
    h2Title.appendChild(spacer);

    //Adiciona o titulo no header
    var titleValue = document.createTextNode(labelValue);
    titleHolder.setAttribute('class', 'ui-box-title');
    titleHolder.appendChild(titleValue);
    h2Title.appendChild(titleHolder);

    headerDiv.appendChild(h2Title);
    this.$element.append(headerDiv);
  };

  Box.prototype.createBoxContent = function(){
    var content = document.createElement('div')
    , contentToggle = document.createElement('div')
    ;

    //<div class="box-content><div class="box-content-toggle">
    content.setAttribute('class', 'box-content');
    contentToggle.setAttribute('class', 'box-content-toggle');
    content.appendChild(contentToggle);
    contentToggle.appendChild(this.content);
    this.$element.append(content);
  };
  
  
   /* PLUGIN
  * ====================== */
  $.fn.box = function (option) {
    return this.each(function () {
        
      var $this = $(this)
          , data = $this.data('ui-box');
        
        if (!data) $this.data('ui-box', (data = new Box(this)));
        if (typeof option == 'string') data[option]();
      });
   };
   
  $.fn.box.Constructor = Box;