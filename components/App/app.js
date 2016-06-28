define(
  ['libs/knockout'],
  function(ko){
    return function() {
      var self = this;
      var countryDataset;
      var countryDatasetSigCount;

      var constituencyDataset;
      var constituencyDatasetSigCount;

      self.petitionId = ko.observable("131215");

      self.petitionAction = ko.observable("");
      self.petitionBackground = ko.observable("");
      self.petitionCreatedOn = ko.observable("");
      self.petitionCreator = ko.observable("");
      self.petitionSignatureCount = ko.observable(0);
      self.petitionByConstituency = ko.observableArray([]);
      self.petitionByCountry = ko.observableArray([]);
      self.petitionState = ko.observable("");
      self.petitionLastUpdated = ko.observable("");

      self.showWhat = ko.observable('detail');
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
            self.petitionCreatedOn(moment(jsonData.data.attributes.created_at).toString());
            self.petitionCreator(jsonData.data.attributes.creator_name);
            self.petitionSignatureCount(jsonData.data.attributes.signature_count);
            self.petitionByConstituency(jsonData.data.attributes.signatures_by_constituency);
            self.petitionByCountry(jsonData.data.attributes.signatures_by_country);
            self.petitionState(jsonData.data.attributes.state);
            self.petitionLastUpdated(moment(jsonData.data.attributes.updated_at).toString());

            self.petitionByConstituency.sort(function srt(a, b) {
              return a.signature_count < b.signature_count ? 1 : -1;
            });
            self.petitionByCountry.sort(function srt(a, b) {
              return a.signature_count < b.signature_count ? 1 : -1;
            });

            self.GenerateCountryDataset(jsonData.data.attributes.signatures_by_country,10);
            self.GenerateConstituencyDataset(jsonData.data.attributes.signatures_by_constituency,10);

            self.isLoading(false);
            self.loadSuccess(true);
            self.showWhat("detail");
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

      self.getPercentage = function(amount){
        return ((amount/self.petitionSignatureCount()) * 100).toFixed(2);
      };

      self.showDetails = function(){
        self.showWhat("detail");
      };

      self.showTables = function(){
        self.showWhat("tables");
      };

      self.showCountryCharts = function(){
        self.showWhat("country-charts");
        //self.displayCountryGraph();
        displayCountryGraph();
      };

      self.showConstituencyCharts = function(){
        self.showWhat("constit-charts");
        displayConstituencyGraph();
      };

      self.GenerateCountryDataset = function(data, toShow){
        //Currently Barchart only.
        var dataAndLabels = {labels:[],data:[]};
        var dataAndLabelsSigCount = {labels:[],data:[]};

        if(toShow > data.length){
          toShow = data.length;
        }
        for(var i = 0; i < toShow;i++){
            dataAndLabelsSigCount.labels.push(data[i].name);
            dataAndLabels.labels.push(data[i].name);
            var percent = self.getPercentage(data[i].signature_count);
            dataAndLabels.data.push(percent);
            dataAndLabelsSigCount.data.push(data[i].signature_count);
        }

        countryDataset = {
          labels: dataAndLabels.labels,
          datasets:[
            {
              label: "Signature Count % - Top " + toShow + " (Country)",
              backgroundColor: "rgba(255,99,132,0.5)",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.75)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: dataAndLabels.data
            }
          ]
        };

        countryDatasetSigCount = {
          labels: dataAndLabelsSigCount.labels,
          datasets:[
            {
              label: "Signature Count - Top " + toShow + " (Country)",
              backgroundColor: "rgba(99,255,132,0.5)",
              borderColor: "rgba(99,255,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(99,255,132,0.75)",
              hoverBorderColor: "rgba(99,255,132,1)",
              data: dataAndLabelsSigCount.data
            }
          ]
        };
        //console.log(countryDataset);
      };

      self.GenerateConstituencyDataset = function(data,toShow){
        //Currently Barchart only.
        var dataAndLabels = {labels:[], data:[]};
        var dataAndLabelsSigCount = {labels:[], data:[]};

        console.log(data);
        if(toShow > data.length){
          toShow = data.length;
        }
        for(var i = 0; i < toShow;i++){
          dataAndLabels.labels.push(data[i].name);
          dataAndLabelsSigCount.labels.push(data[i].name);
          var percent = self.getPercentage(data[i].signature_count);
          dataAndLabels.data.push(percent);
          dataAndLabelsSigCount.data.push(data[i].signature_count);
        }

        constituencyDataset = {
          labels: dataAndLabels.labels,
          datasets:[
            {
              label: "Signature Count % - Top " + toShow + " (Constituency)",
              backgroundColor: "rgba(255,99,132,0.5)",
              borderColor: "rgba(255,99,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(255,99,132,0.75)",
              hoverBorderColor: "rgba(255,99,132,1)",
              data: dataAndLabels.data
            }
          ]
        };

        constituencyDatasetSigCount = {
          labels: dataAndLabelsSigCount.labels,
          datasets:[
            {
              label: "Signature Count - Top " + toShow + " (Constituency)",
              backgroundColor: "rgba(99,255,132,0.5)",
              borderColor: "rgba(99,255,132,1)",
              borderWidth: 1,
              hoverBackgroundColor: "rgba(99,255,132,0.75)",
              hoverBorderColor: "rgba(99,255,132,1)",
              data: dataAndLabelsSigCount.data
            }
          ]
        };
        //console.log(constituencyDataset);
      };

      function displayConstituencyGraph(){
        //console.log("attempting to display country graph.");
        var ctxBar = document.getElementById("constituencyChartBar");
        var ctxRadar = document.getElementById("constituencyChartRadar");

        var ctxSigBar = document.getElementById("constituencyChartSigBar");
        var ctxSigRadar = document.getElementById("constituencyChartSigRadar");
        //console.log(ctx);
        var constituencyChartMain = new Chart(ctxBar,{type:'bar',data: constituencyDataset,options:{scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
        var constituencyChartRadar = new Chart(ctxRadar,{type:'radar',data: constituencyDataset});

        var constituencyChartMainSig = new Chart(ctxSigBar,{type:'bar',data: constituencyDatasetSigCount,options:{scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
        var constituencyChartRadarSig = new Chart(ctxSigRadar,{type:'radar',data: constituencyDatasetSigCount});
      }

      function displayCountryGraph(){
        var ctxBar = document.getElementById("countryChartBar");
        var ctxRadar = document.getElementById("countryChartRadar");

        var ctxSigBar = document.getElementById("countryChartSigBar");
        var ctxSigRadar = document.getElementById("countryChartSigRadar");
        //console.log(ctx);
        var countryChartMain = new Chart(ctxBar,{type:'bar',data: countryDataset,options:{scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
        var countryChartRadar = new Chart(ctxRadar,{type:'radar',data: countryDataset});

        var countryChartMainSig = new Chart(ctxSigBar,{type:'bar',data: countryDatasetSigCount,options:{scales:{yAxes:[{ticks:{beginAtZero:true}}]}}});
        var countryChartRadarSig = new Chart(ctxSigRadar,{type:'radar',data: countryDatasetSigCount});
      }
      self.LoadPetitionData();
    };
  }
);
