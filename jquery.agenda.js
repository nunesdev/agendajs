/*
 * Agenda
 * 1.0.0
 * Bruno Nunes (http://lab.brunodev.com.br/agendajs )
 * 
 * */
(function( $ )
{
  var config = {
  	el : '',
  	meses : ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  };
  
  var metodos = {
    init : function( opcoes )
    { 
    	
     	return this.each(function()
     	{
         var $this = $(this);
         
         config.el = $this;
         
         metodos.renderMeses();
         metodos.handler.click();
         
         config.el.append('<div class="agenda-events-list"><div>');
       });
       
       
    },
    
    renderMeses: function()
    {
    	var $currentMonth = metodos.helper.getMonth()+1;
    	var $meses = '';
    	$meses = "<ul class='agenda-events-meses'>";
	    	$.each(config.meses,function(index,value){
	    		
	    		if($currentMonth == index+1){
	    			$meses += "<li><a class='ag-mes current' data-mes='"+(index+1)+"' href='#agenda/"+(index+1)+"' >"+value+"</a></li>";
	    		}else{
	    			$meses += "<li><a class='ag-mes' data-mes='"+(index+1)+"' href='#agenda/"+(index+1)+"' >"+value+"</a></li>";
	    		}
	    		
	    	});
    	$meses += "</ul>";
    	
    	config.el.html($meses).append(metodos.renderDias($currentMonth));
    	metodos.renderEvents(metodos.helper.getDay(),$currentMonth,metodos.helper.getAno());
    },
    
    renderDias: function($mes)
    {
    	var $dias = metodos.helper.getDiasFromMes($mes);
    	var $diaAtual = metodos.helper.getDay(); 
    	var $mesAtual = metodos.helper.getMonth()+1;
    	
    	$ul = "<ul data-mes='"+$mes+"' class='agenda-events-dias'>";
	    	for(var i=0;i<$dias;i++)
	    	{
	    		if($diaAtual == (i+1) && $mes == $mesAtual)
	    		{
	    			$ul += "<li><a class='ag-mes-dia current' data-mes='"+$mes+"' data-dia='"+(i+1)+"' href='#agenda/"+$mes+"/"+(i+1)+"'>"+(i+1)+"</a></li>"
	    		}else{
	    			$ul += "<li><a class='ag-mes-dia' data-mes='"+$mes+"' data-dia='"+(i+1)+"' href='#agenda/"+$mes+"/"+(i+1)+"'>"+(i+1)+"</a></li>"
	    		}
	    		
	    	}
    	$ul += "</ul>";
    	return $ul;
    },
    
    renderEvents: function(dia,mes,ano)
    {
    	$.ajax
    	({
    		type:'POST',
    		url:'agenda.php',
    		data:'dia='+dia+'&mes='+mes+'&ano='+ano,
    		dataType:'json',
    		beforeSend:function()
    		{
    			$('.agenda-events-list').html("<div>Buscando eventos...</div>");
    		},
    		complete:function()
    		{
    			
    		},
    		success: function(response)
    		{
    			
	    		var $events = '';	
	    		if(response.status == 'ok')
	    		{
	    			$.each(response.result,function(index,value)
	    			{
	    				$events += '<div class="event"><h3>'+value.titulo+'</h3>';
	    					$events += '<p><strong>Local:</strong> '+value.local+'</p>';
	    					$events += '<p><strong>Data:</strong> '+value.data+'</p>';
	    					$events += '<p><strong>Horário:</strong> '+value.hora+'</p>';
	    					$events += '<p><strong>Entrada:</strong> '+value.entrada+'</p>';
	    				$events += '</div>';
	    			});
	    		}else{
	    			$events += '<div><p>Não há eventos.</p></div>';
	    		}
	    		
    			$(".agenda-events-list").html($events);
    		}
    	});
    },
    
    handler :
    {
    	click : function()
    	{
    		$('.ag-mes').on('click',function()
    		{
    			
    			$('.ag-mes').each(function()
    			{
    				$(this).removeClass('current');
    			});
    			
    			$('.ag-mes-dia').each(function()
    			{
    				$(this).removeClass('current');
    			});
    			
    			$(this).addClass('current');
    			var $mes = $(this).data('mes');
    			
    			var $dias = metodos.renderDias($mes);
    			config.el.find('.agenda-events-dias').remove();
    			config.el.find('.agenda-events-meses').after($dias);
    			metodos.renderEvents('',$mes,metodos.helper.getAno());
    		});
    		
    		$(document).on('click','.ag-mes-dia',function()
    		{
    			$('.ag-mes-dia').each(function()
    			{
    				$(this).removeClass('current');
    			});
    			
    			$(this).addClass('current');
    			
    			metodos.renderEvents($(this).data("dia"),$(this).data("mes"),metodos.helper.getAno());
    		});	
    	}
    },
    helper :
    {
    	getDiasFromMes: function(mes)
    	{
	    	Hoje = new Date();
	    	Ano = Hoje.getFullYear();
	    	
	    	return new Date(Ano, mes, 0).getDate();
	    },
	    
	    getAno: function()
	    {
	    	Hoje = new Date();
	    	return Hoje.getFullYear();
	    },
	    
	    getMonth: function()
	    {
	    	Hoje = new Date();
	    	return Hoje.getMonth();
	    },
	    
	    getDay: function()
	    {
	    	Hoje = new Date();
	    	return Hoje.getDate();
	    },
	    
	    addCurrent: function($el)
	    {
	    	$el.addClass('current');
	    },
	    
	    removeCurrent: function($el)
	    {
	    	$el.each(function(){
	    		$(this).removeClass('current');
	    	});
	    }
    },
    
    
  };
 
  $.fn.agenda = function( metodo )
  {
    
    // Metódo de chamada
    if ( metodos[metodo] )
    {
      
      return metodos[metodo].apply( this, Array.prototype.slice.call( arguments, 1 ));
    
    } else if ( typeof metodo === 'object' || ! metodo ) {
      return metodos.init.apply( this, arguments );
    
    } else {
      $.error( 'Método ' +  metodo + ' no plugin.agenda .agenda' );
    }    
  
  };
 
})( jQuery );