---
layout: post
title: jqGrid 공통설정
categories: [jqGrid, javascript]
tags: [jqgrid, javascript]
description: jqGrid 공통설정
---

GitHub 로 포스팅을 할 겸 연습삼아 jqGrid 의 공통 설정을 공유한다.
json 기반의 jqGrid 설정으로 상세 설정은 좀 더 익숙해 지면 추가하겠다. 

{% highlight javascript %}
/**
 * jqGrid 공통 설정 및 함수 확장
 *
 * @external jqGrid
 * @exports jqgrid
 * @see {@link http://www.trirand.com/jqgridwiki/doku.php jqGrid wiki}
 * @see {@link http://trirand.com/blog/jqgrid/jqgrid.html jqGrid demo}
 */

(function($) {
	/**
	 * project default common setting ContextRoot 값을 리턴
	 */
	jQuery.extend(jQuery.jgrid.defaults, {
		autoencode : true,
		rowNum : 10,
		rownumbers : true,              // 행번호 표시
		headertitles : true,
		forceFit : true,
		viewrecords : true,
		datatype : "json",
		autowidth : true,
		height : '200',                 // 'auto'
		mtype : 'POST',
		jsonReader : {
			root : "data",
			page : "page",
			total : "total",
			records : "records",
			repeatitems : false
		},
		// 기본 정렬 속성 제거
		cmTemplate : {
			sortable : false,
			resizable : true
		},
		beforeRequest : function() {
			var $this = $(this);
			$this.parents("div.ui-jqgrid-bdiv").find("div.no-data").empty().remove();
			if (this.p) {
				if (this.p.datatype == "json") {
					if (this.p.url == "") {
						$(this).noData();
						return false;
					}
				}
			}
		},
		loadError : function(xhr, status, error) {
			var $this = $(this);
			$this.parents("div.ui-jqgrid-bdiv").find("div.no-data").empty().remove();
			$this.parents("div.ui-jqgrid-bdiv").append('<div class="no-data">Load Error</div>');
		}
	});
});
{% endhighlight %}
