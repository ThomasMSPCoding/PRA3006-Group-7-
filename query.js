class SPARQLQueryDispatcher {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
  
    query(sparqlQuery) {
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);
        const headers = { 'Accept': 'application/sparql-results+json' };
  
        return fetch(fullUrl, { headers }).then(body => body.json());
    }
  }
  
  const cancerName = [
    3658562, // lung
    192102,  // skin
    128581,  // breast
    181257,  // prostate
    9303627, // brain
    29496,   // leukemia
    208414,  // lymphoma
    3242950, // kidney
    623031,  // liver
    212961,  // pancreatic
    826522,  // thyroid
    18555222, // endometrial
    18555025  // colon
  ];
  
  // Generate query for each cancer type
  function getQuery(cancerNames) {
    const formattedValue = cancerNames.map((name) => `wd:Q${name}`);
    const sparqlQuery = `
        SELECT DISTINCT ?disease ?diseaseLabel 
        (GROUP_CONCAT(DISTINCT (STRAFTER(STR(?symptom), "/entity/")); separator=", ") AS ?symptomsQ) 
        (GROUP_CONCAT(DISTINCT ?symptomLabel; separator=", ") AS ?symptoms) 
        (GROUP_CONCAT(DISTINCT ?treatmentLabel; separator=", ") AS ?treatments) 
        (GROUP_CONCAT(DISTINCT ?locationLabel; separator=", ") AS ?locations)
        WHERE {
            VALUES ?disease {${formattedValue.join(' ')}}
            OPTIONAL { ?disease wdt:P780 ?symptom.
                       ?symptom rdfs:label ?symptomLabel FILTER(LANG(?symptomLabel) = "en") }
            OPTIONAL { ?disease wdt:P2176 ?treatment.
                       ?treatment rdfs:label ?treatmentLabel FILTER(LANG(?treatmentLabel) = "en") }
            OPTIONAL { ?disease wdt:P927 ?location.
                       ?location rdfs:label ?locationLabel FILTER(LANG(?locationLabel) = "en") }
            SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
        }
        GROUP BY ?disease ?diseaseLabel
        ORDER BY ?diseaseLabel
    `;
    return sparqlQuery;
  }
  
  // Generate the query
  const sparqlQuery = getQuery(cancerName);
  
  // SPARQL endpoint URL
  const endpointUrl = 'https://query.wikidata.org/sparql';
  
  // Create an instance of SPARQLQueryDispatcher
  const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  
  // Execute the query and display the results
  queryDispatcher.query(sparqlQuery)
    .then((result) => {
        displayResults(result);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
  
  // Function to display results on the HTML page
  function displayResults(result) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h2>SPARQL Query Results:</h2>';
  
    if (result.results.bindings.length === 0) {
        resultsDiv.innerHTML += '<p>No results found.</p>';
        return;
    }
  
    // Create a table to display results
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Disease</th>
            <th>Symptoms</th>
            <th>Treatments</th>
            <th>Locations</th>
        </tr>
    `;
  
    result.results.bindings.forEach((binding) => {
        const disease = binding.diseaseLabel?.value || "N/A";
        const symptoms = binding.symptoms?.value || "N/A";
        const treatments = binding.treatments?.value || "N/A";
        const locations = binding.locations?.value || "N/A";
  
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${disease}</td>
            <td>${symptoms}</td>
            <td>${treatments}</td>
            <td>${locations}</td>
        `;
        table.appendChild(row);
    });
  
    resultsDiv.appendChild(table);
  }
  