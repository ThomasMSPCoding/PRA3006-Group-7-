class SPARQLQueryDispatcher {
	constructor( endpoint ) {
		this.endpoint = endpoint;
	}

	query( sparqlQuery ) {
		const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
		const headers = { 'Accept': 'application/sparql-results+json' };

		return fetch( fullUrl, { headers } ).then( body => body.json() );
	}
}

const cancerType = [3658562, //lung
    192102, //skin
    128581, //breast
    181257, //prostate
    9303627, //brain
    29496, //leukemia
    208414, //lymphoma
    3242950, //kidney
    623031, //liver
    212961, //pancreatic
    826522, //thyroid
    18555222, //endometrial
    18555025]; //colon

    //Generate query for each cancer type
    function getQuery(cancerTypes) {
        // Add "Q" prefix to each number in the array
        const formattedValue = cancerTypes.map((type) => `wd:Q${type}`);
      
        // Generate the SPARQL query
        var sparqlQuery = `SELECT DISTINCT ?disease ?diseaseLabel 
          (GROUP_CONCAT(DISTINCT ?symptomLabel; separator=", ") AS ?symptoms) 
          (GROUP_CONCAT(DISTINCT ?treatmentLabel; separator=", ") AS ?treatments) 
          (GROUP_CONCAT(DISTINCT ?locationLabel; separator=", ") AS ?locations)
          WHERE {
            VALUES ?disease {${formattedValue}}      # Dynamically add all WD numbers here
            OPTIONAL { ?disease wdt:P780 ?symptom.    # Retrieve symptoms (P780) if available
                       ?symptom rdfs:label ?symptomLabel FILTER(LANG(?symptomLabel) = "en") }
            OPTIONAL { ?disease wdt:P2176 ?treatment. # Retrieve treatments (P2176) if available
                       ?treatment rdfs:label ?treatmentLabel FILTER(LANG(?treatmentLabel) = "en") }
            OPTIONAL { ?disease wdt:P927 ?location.   # Retrieve locations (P927) if available
                       ?location rdfs:label ?locationLabel FILTER(LANG(?locationLabel) = "en") }
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
          }
          GROUP BY ?disease ?diseaseLabel
          ORDER BY ?diseaseLabel`;
        return sparqlQuery;
      }
      
// Generate the query using the cancerType array
const sparqlQuery = getQuery(cancerType);

// SPARQL endpoint URL
const endpointUrl = 'https://query.wikidata.org/sparql';

// Create an instance of SPARQLQueryDispatcher
const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );

// Execute the query and log the results
queryDispatcher.query(sparqlQuery).then((result) => {
    console.log(result);
  }).catch((error) => {
    console.error("Error fetching data:", error);
  });