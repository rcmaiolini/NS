'use strict';

$(document).ready( function() {
	Globalize.culture('pt-BR');
	var currency;
	var leftCollection = [];
	var rightCollection = [];

	function countProd() {
		var count = 0;
		var i = 0;
		for(i; i < rightCollection.length; ++i){
			count += rightCollection[i].qtd;
		}
		$('.count').html(count);
	}

	function rightInstallments(soma){
		soma = soma / 10;
		$('.val .rightInstallments').html("ou em ate 10 x de " + currency + ' ' + Globalize.format(soma, 'n'));
	}

	function leftInstallments() {
		var i = 0;
		for(i; i < leftCollection.length; ++i){
			leftCollection[i].installmentsPrice = Globalize.format(leftCollection[i].price / leftCollection[i].installments, 'n');
		}
	}

	function subTotal(){
		var soma = 0;
		var i = 0;
		for(i; i < rightCollection.length; ++i){
			if(rightCollection[i].sumPrice){
				soma += rightCollection[i].sumPrice;
			}else{
				soma += rightCollection[i].price;
			}
		}
		$('.val .total').html(currency + ' ' + Globalize.format(soma, 'n'));
		rightInstallments(soma);
	}

	function delProd(data) {
		$('.close').hover(
			function() {
				$(this).closest('li').addClass('quit');
			}, function() {
				$(this).closest('li').removeClass('quit');
		});

		$('.close').click(
			function(){
				var getId = $(this).data('id');
				var item = getProductByIdRightCollection(getId);
				rightCollection.splice(item,1);
				
				if(rightCollection.length == 0){
					$('.prodBuy').append('<li class="msg">Nenhum produto na sacola!</li>');
				}
				$(this).closest('li').remove();
				countProd();
				subTotal();
		});
	}

	function getProductByIdRightCollection(id){
		var i = 0;
		for(i; i < rightCollection.length; ++i){
			if(id == rightCollection[i].id){
				return rightCollection[i];
			}
		}
	}

	function addNewProduct(product){
		rightCollection.unshift(product);
		product.qtd = 1;
	}

	function findProductById(data, id){
		var i = 0;
		for(i; i < data.products.length; ++i){
			if(id === data.products[i].id){
				return data.products[i];
			}
		}
	}

	function addProd(data) {
		$('.add').click(function(){ 
			var getId = $(this).data('id');
			var product = findProductById(data, getId);
			if(rightCollection.length){
				var item = getProductByIdRightCollection(getId);
				if(item){
					item.qtd++;
					item.sumPrice = item.qtd * item.price;
					item.currencyPrice = Globalize.format(item.sumPrice, 'n');
				}else{
					addNewProduct(product);
				}
			}else{
				addNewProduct(product);
			}
			$(".right ul").html($("#rightProdTmpl").tmpl(rightCollection));

			localStorage.setItem("list_data_key",  JSON.stringify(rightCollection));

			countProd();
			subTotal();
			delProd(data);
		});
	}

	function leftProd(data){
		leftCollection = data.products;
		leftInstallments();
		$(".left ul").html($("#leftProdTmpl").tmpl(leftCollection));
	}

	function rightProd(data){
		if(rightCollection.length == 0){
			$('.prodBuy').append('<li class="msg">Nenhum produto na sacola!</li>');
		}
		addProd(data);
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
		subTotal();
	});

});
