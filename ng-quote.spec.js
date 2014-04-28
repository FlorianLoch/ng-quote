describe("This suite shall test ng-quote", function () {
	var $compile, $rootScope, $httpBackend, scope;
	var quote = {
		id: 42,
        quote: "This is a mocked quote!",
        author: "Florian Loch",
        permalink: "Who will access this quote?!?" 
    };

	beforeEach(function () {
		module("ng-quote");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$httpBackend = _$httpBackend_;
	}));

	beforeEach(function () {
        $httpBackend.
        	when('JSONP', 'http://quotesondesign.com/api/3.0/api-3.0.json?callback=JSON_CALLBACK').
        	respond(quote);
	});

	it("should bind the attributes values to the scope", function () {
		var loadingText = "My loading text";
		var errorText = "My error text";

		compileAgainstRootScope("<ngquote loadingtext='" + loadingText + "' errortext='" + errorText + "'></ngquote>");

		expect(scope.loading).toBe(true);
		expect(scope.loadingText).toEqual(loadingText);

		expect(scope.errorText).toEqual(errorText);
	});

	it("should fall back to default values if attributes have not been set", function () {
		compileAgainstRootScope("<ngquote></ngquote>");

		expect(scope.loadingText).toEqual("Loading...");
		expect(scope.errorText).toEqual("Error while loading quote. Sorry :(");
	});

	it("should get a quote and display it", function () {
		var elem = compileAgainstRootScope("<ngquote></ngquote>");

		$httpBackend.flush();

		expect(elem.html()).toEqual('<!-- ngIf: !loading --><div ng-if="!loading" class="ng-scope ng-binding">This is a mocked quote!<br><div style="width: 100%; text-align: right;"><small class="ng-binding">Florian Loch</small></div></div><!-- end ngIf: !loading --><!-- ngIf: loading -->');
	});

	function compileAgainstRootScope(html) {
		var element = angular.element(html);

		$compile(element)($rootScope.$new());
		scope = element.isolateScope(); //Found on http://stackoverflow.com/questions/18713909/testing-element-directive-cant-access-isolated-scope-methods-during-tests

		return element;
	}
});