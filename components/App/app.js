define(
  ['libs/knockout'],
  function(ko){
    return function() {
      var self = this;

      self.petitionId = ko.observable("0");

      self.petitionAction = ko.observable("");
      self.petitionBackground = ko.observable("");
      self.petitionCreatedOn = ko.observable("");
      self.petitionCreator = ko.observable("");
      self.petitionSignatureCount = ko.observable("");
      self.petitionByConstituency = ko.observableArray([]);
      self.petitionByCountry = ko.observableArray([]);
      self.petitionState = ko.observable("");

      self.showByConstituency = ko.observable(false);
      self.showByCountry = ko.observable(false);
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
            var jsonData = JSON.parse(this.response);

            window.Config.JsonData = jsonData;
            self.petitionAction(jsonData.data.attributes.action);
            self.petitionBackground(jsonData.data.attributes.background);
            self.petitionCreatedOn(jsonData.data.attributes.created_at);
            self.petitionCreator(jsonData.data.attributes.creator_name);
            self.petitionSignatureCount(jsonData.data.attributes.signature_count);
            self.petitionByConstituency(jsonData.data.attributes.signatures_by_constituency);
            self.petitionByCountry(jsonData.data.attributes.signatures_by_country);
            self.petitionState(jsonData.data.attributes.state);

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

      self.toggleByCountries = function(){
        if(self.showByCountry()){
          self.showByCountry(false);
        }
        else {
          self.showByCountry(true);
        }
      };

      self.toggleByConstituencies = function(){
        if(self.showByConstituency()){
          self.showByConstituency(false);
        }
        else{
          self.showByConstituency(true);
        }
      };
    };
  }
);
