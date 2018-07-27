'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {


  it('should automatically redirect to /calc when location hash/fragment is empty', function() {
    browser.get('index.html');
    expect(browser.getLocationAbsUrl()).toMatch("/calc");
  });


  describe('calc', function() {

    beforeEach(function() {
      browser.get('index.html#!/calc');
    });


    it('should render calc when user navigates to /calc', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('about', function() {

    beforeEach(function() {
      browser.get('index.html#!/about');
    });


    it('should render about when user navigates to /about', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
