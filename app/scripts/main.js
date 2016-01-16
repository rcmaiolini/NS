'use strict';

$(document).ready( function() {
	Globalize.culture('pt-BR');
	var currency;

	function countProd() {
		var getLi = $('.prodBuy li').length;
		$('.count').html(getLi);
	}

	function installments(soma){
		soma = soma / 10;
		$('.val .installments').html(currency + ' ' + Globalize.format( soma, 'n' ));
	}

	function subTotal(){
		var soma = 0;
		$('.prodBuy li .price').each(
			function() {
				soma += parseFloat($(this).data('price'));
			}
			);
		$('.val .total').html(currency + ' ' + Globalize.format( soma, 'n' ));
		installments(soma);
	}

	function delProd() {
		$('.close').hover(
			function() {
				$(this).closest('li').addClass('quit');
			}, function() {
				$(this).closest('li').removeClass('quit');
		});

		$('.close').click(
			function(){
				$(this).closest('li').remove();
				countProd();
				subTotal();
		});
	}

	function leftProd(data){
		$('#leftProdTmpl').tmpl(data.products.slice(6, 9)).appendTo('.left ul');
	}

	function rightProd(data){
		$('#rightProdTmpl').tmpl(data.products.slice(12, 16)).appendTo('.right ul');
		delProd();
	}

	function fixPrice(data) {
		var i = 0;
		for(i; i < data.products.length; ++i){
			data.products[i].currencyPrice = Globalize.format(data.products[i].price, 'n');         
		}
	}

	$.getJSON('./data/products.json').done(function(data){
		currency = data.products[0].currencyFormat;
		fixPrice(data);
		leftProd(data);
		rightProd(data);
		countProd();
		subTotal();
	});
});
