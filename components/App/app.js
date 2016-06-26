define(
  ['libs/knockout'],
  function(ko){
    return function() {
      var self = this;

      self.petitionId = ko.observable("0");

      self.loadSuccess = ko.observable(false);
      self.isLoading = ko.observable(false);
      self.errorMessages = ko.observableArray([]);
      self.showErrors = ko.computed(function() {
        if(self.errorMessages().length > 0)
          return true;

        return false;
      });

      self.LoadPetitionData = function(){
        self.isLoading(true);
        var request = new XMLHttpRequest();
        request.open('GET', window.Config.BaseUrl + self.petitionId() + '.json', true);
        request.setRequestHeader('Accept', 'application/json');

        request.onload = function(){
          if(this.status >= 200 && this.status < 400){
            window.Config.JsonData = JSON.parse(this.response);
            self.isLoading(false);
            self.loadSuccess(true);
          }
          else {
            self.isLoading(false);
            self.loadSuccess(false);
          }
        };

        request.onerror = function() {
          self.isLoading(false);
          self.loadSuccess(false);
        };
        request.send();
      };
    };
  }
);
