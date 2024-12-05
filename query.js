/**
 * SPARQLQueryDispatcher Class
 * This class is designed to send SPARQL queries to a specified endpoint and return the results.
 */
class SPARQLQueryDispatcher {
    /**
     * Constructor for the SPARQLQueryDispatcher class.
     * @param {string} endpoint - The URL of the SPARQL endpoint.
     */
    constructor(endpoint) {
        this.endpoint = endpoint; // Store the endpoint URL for the SPARQL queries
    }

    /**
     * Sends a SPARQL query to the endpoint and retrieves the results.
     * @param {string} sparqlQuery - The SPARQL query to execute.
     * @returns {Promise} - A promise that resolves with the query results in JSON format.
     */
    query(sparqlQuery) {
        // Construct the full URL by appending the query to the endpoint
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent(sparqlQuery);

        // Define the HTTP headers to specify the response format
        const headers = { 'Accept': 'application/sparql-results+json' };

        // Use the Fetch API to send the query and return the response as JSON
        return fetch(fullUrl, { headers })
            .then(body => body.json()); // Parse and return the JSON response
    }
}

/**
 * A list of unique identifiers (IDs) for different types of cancer.
 * These IDs are used to query specific information about each cancer type
 * from a database that supports SPARQL queries.
 */
const cancerName = [
    3658562,  // Lung cancer
    192102,   // Skin cancer
    128581,   // Breast cancer
    181257,   // Prostate cancer
    9303627,  // Brain cancer
    29496,    // Leukemia
    208414,   // Lymphoma
    3242950,  // Kidney cancer
    623031,   // Liver cancer
    212961,   // Pancreatic cancer
    826522,   // Thyroid cancer
    18555222, // Endometrial cancer
    18555025  // Colon cancer
];

  
  // Generate query for each cancer type
  /**
 * Generates a SPARQL query to fetch information about each cancer type.
 * This includes symptoms, treatments, and commonly affected locations.
 * 
 * @param {Array} cancerNames - An array of numeric IDs representing different cancer types.
 * @returns {string} - The SPARQL query string.
 */
function getQuery(cancerNames) {
    // Format the cancer IDs into SPARQL entity references (e.g., "wd:Q12345")
    const formattedValue = cancerNames.map((name) => `wd:Q${name}`);

    // Construct the SPARQL query using the formatted IDs
    const sparqlQuery = `
        SELECT DISTINCT ?disease ?diseaseLabel 
        (GROUP_CONCAT(DISTINCT (STRAFTER(STR(?symptom), "/entity/")); separator=", ") AS ?symptomsQ) 
        (GROUP_CONCAT(DISTINCT ?symptomLabel; separator=", ") AS ?symptoms) 
        (GROUP_CONCAT(DISTINCT ?treatmentLabel; separator=", ") AS ?treatments) 
        (GROUP_CONCAT(DISTINCT ?locationLabel; separator=", ") AS ?locations)
        WHERE {
            VALUES ?disease {${formattedValue.join(' ')}} 
            # Matches diseases with the provided IDs

            # Optional block to fetch symptoms of the disease
            OPTIONAL { 
                ?disease wdt:P780 ?symptom.
                ?symptom rdfs:label ?symptomLabel FILTER(LANG(?symptomLabel) = "en") 
            }

            # Optional block to fetch treatments for the disease
            OPTIONAL { 
                ?disease wdt:P2176 ?treatment.
                ?treatment rdfs:label ?treatmentLabel FILTER(LANG(?treatmentLabel) = "en") 
            }

            # Optional block to fetch common locations affected by the disease
            OPTIONAL { 
                ?disease wdt:P927 ?location.
                ?location rdfs:label ?locationLabel FILTER(LANG(?locationLabel) = "en") 
            }

            # Ensures labels are returned in the preferred language (English)
            SERVICE wikibase:label { 
                bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". 
            }
        }
        # Groups results by disease and its label for clarity
        GROUP BY ?disease ?diseaseLabel

        # Orders the results alphabetically by the disease label
        ORDER BY ?diseaseLabel
    `;

    // Return the constructed query as a string
    return sparqlQuery;
}

  
// Generate the SPARQL query using the getQuery function and the list of cancer IDs
const sparqlQuery = getQuery(cancerName);
  
// Define the URL of the SPARQL endpoint where the query will be sent
const endpointUrl = 'https://query.wikidata.org/sparql';
  
// Create an instance of SPARQLQueryDispatcher to handle the query
const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl);
  
// Execute the SPARQL query and process the results
queryDispatcher.query(sparqlQuery)
.then((result) => {
        // Iterate through the results for each disease
        result.results.bindings.forEach((binding) => {
            // Ensure that the 'symptomsQ' field exists for each result
            // If 'symptomsQ' is missing, set it to an empty string
        binding.symptomsQ = { value: binding.symptomsQ?.value || "" };
    });
            // Pass the processed results to the displayResults function
    displayResults(result);

    // Execute the second query for symptoms
    executeSecondQuery(result);
})
.catch((error) => {
    // Log an error to the console if the first query fails
    console.error("Error fetching data:", error);
});

/**
 * Generates a SPARQL query to fetch detailed information about symptoms.
 * 
 * @param {Array} symptomsQN - An array of symptom IDs retrieved from the first query.
 * @returns {string} - A SPARQL query string to fetch symptom details and related Wikipedia articles.
 */
function getSymptomQuery(symptomsQN) {
    // Format symptom IDs for the SPARQL query (e.g., "wd:Q12345")
    const formattedSymptoms = symptomsQN.map(symptom => `wd:${symptom}`).join(' ');

    // Construct the SPARQL query
    return `
        SELECT ?symptom ?symptomLabel ?article
        WHERE {
            # Filter for specific symptoms using their IDs
            VALUES ?symptom {${formattedSymptoms}}
            
            # Fetch the label (name) of each symptom in English
            ?symptom rdfs:label ?symptomLabel 
            FILTER(LANG(?symptomLabel) = "en")
            
            # Optionally fetch links to related English Wikipedia articles
            OPTIONAL {
                ?article schema:about ?symptom .  # Link article to symptom
                ?article schema:inLanguage "en" . # Ensure the article is in English
                # Ensure the article URL starts with "https://en.wikipedia.org/"
                FILTER (SUBSTR(str(?article), 1, 25) = "https://en.wikipedia.org/")
            }
        }
    `;
}


/**
 * Executes the second query to fetch detailed information about symptoms
 * using the data retrieved from the first query.
 *
 * @param {Object} result - The results of the first query, containing data about diseases.
 */
function executeSecondQuery(result) {
    // Step 1: Extract all 'symptomsQ' values from the first query's results
    const symptomsQList = result.results.bindings
        .map(binding => binding.symptomsQ?.value || "") // Get the value of 'symptomsQ' or use an empty string if it doesn't exist
        .filter(symptomQ => symptomQ !== "") // Exclude any empty values
        .flatMap(symptomQ => symptomQ.split(", ").map(symptom => symptom.trim())) 
        // De-concatenate 'symptomsQ' values that are combined into a single string, splitting them into individual IDs
        .filter((symptom, index, self) => self.indexOf(symptom) === index); 
        // Remove duplicate symptom IDs to avoid redundant queries

    // Step 2: Check if there are any valid symptomsQ values
    if (symptomsQList.length === 0) {
        console.warn("No symptomsQ data found for the second query."); 
        // Log a warning if no symptomsQ data is found
        return; // Exit the function early
    }

    // Continue with the execution of the second query if valid symptomsQ values are found
    const symptomQuery = getSymptomQuery(symptomsQList); // Generate the SPARQL query for the symptoms
    const queryDispatcher = new SPARQLQueryDispatcher(endpointUrl); // Create a new query dispatcher for the SPARQL endpoint

    // Send the second query to fetch detailed symptom information
    queryDispatcher.query(symptomQuery)
        .then((symptomResult) => {
            displaySymptomResults(symptomResult); // Process and display the symptom data
        })
        .catch((error) => {
            console.error("Error fetching symptoms data:", error); // Handle errors during the second query
        });
}

// Construct second query
const symptomQuery = getSymptomQuery(symptomsQ); 
// Generate the SPARQL query for detailed symptom data using the list of symptom IDs (symptomsQ).

// Execute the second SPARQL query
queryDispatcher.query(symptomQuery)
    .then(secondResult => {
        // If the query is successful, call displaySymptomResults to handle and display the results
        displaySymptomResults(secondResult);
    })
    .catch(error => {
        // Log an error message if the query fails (e.g., network issues or invalid query)
        console.error("Error fetching data for symptoms:", error);
    });

/**
 * Displays the results of the SPARQL query on the HTML page.
 *
 * @param {Object} result - The results of the SPARQL query, containing data about diseases.
 */
function displayResults(result) {
    // Get the HTML element where the results will be displayed
    const resultsDiv = document.getElementById('results');

    // Clear any existing content and add a title
    resultsDiv.innerHTML = '<h2>SPARQL Query Results:</h2>';

    // Check if there are any results in the query response
    if (result.results.bindings.length === 0) {
        // If no results, display a message and exit the function
        resultsDiv.innerHTML += '<p>No results found.</p>';
        return;
    }

    // Create a table element to display the query results
    const table = document.createElement('table');

    // Add the table header with column names
    table.innerHTML = `
        <tr>
            <th>Disease</th>       <!-- Column for disease names -->
            <th>Symptoms</th>      <!-- Column for symptoms associated with the disease -->
            <th>Treatments</th>    <!-- Column for possible treatments -->
            <th>Locations</th>     <!-- Column for affected body locations -->
        </tr>
    `;

    // Loop through each result from the query and add a row to the table
    result.results.bindings.forEach((binding) => {
        // Extract data for each column, providing a fallback value if data is missing
        const disease = binding.diseaseLabel?.value || "N/A"; // Disease name
        const symptoms = binding.symptoms?.value || "N/A";   // Symptoms list
        const treatments = binding.treatments?.value || "N/A"; // Treatments list
        const locations = binding.locations?.value || "N/A";  // Affected locations

        // Create a new row for the table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${disease}</td>       <!-- Disease name -->
            <td>${symptoms}</td>      <!-- Symptoms -->
            <td>${treatments}</td>    <!-- Treatments -->
            <td>${locations}</td>     <!-- Locations -->
        `;

        // Add the row to the table
        table.appendChild(row);
    });

    // Append the completed table to the resultsDiv
    resultsDiv.appendChild(table);
}

// Execute the second query for symptoms
executeSecondQuery(result);  // This triggers the second query based on symptomsQ values from the first query results

/**
 * Displays the results of the second query (symptoms) in a new table on the HTML page.
 *
 * @param {Object} result - The results of the second SPARQL query, containing symptom details.
 */
function displaySymptomResults(result) {
    // Get the HTML element where the results will be displayed
    const resultsDiv = document.getElementById('results');

    // Check if a symptom table already exists, and remove it to prevent duplication
    const existingSymptomTable = document.getElementById('symptomTable');
    if (existingSymptomTable) {
        existingSymptomTable.remove();
    }

    // Create a new table element to display symptom information
    const symptomTable = document.createElement('table');
    symptomTable.id = 'symptomTable'; // Assign an ID to the table for easy identification

    // Add the table header with column names
    symptomTable.innerHTML = `
        <tr>
            <th>Symptom</th>         <!-- Column for the symptom name -->
            <th>Wikipedia Link</th>  <!-- Column for a link to a Wikipedia article about the symptom -->
        </tr>
    `;

    // Loop through the results of the second query and add a row for each symptom
    result.results.bindings.forEach((binding) => {
        // Extract data for the symptom name and the associated Wikipedia link
        const symptom = binding.symptomLabel?.value || "N/A"; // Symptom name
        const article = binding.article?.value || "#";        // Wikipedia link (defaults to "#" if missing)

        // Create a new row for the symptom table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${symptom}</td>                               <!-- Display the symptom name -->
            <td><a href="${article}" target="_blank">Wikipedia</a></td> <!-- Link to the Wikipedia article -->
        `;

        // Add the row to the table
        symptomTable.appendChild(row);
    });

    // Append the new symptom table to the resultsDiv
    resultsDiv.appendChild(symptomTable);
}
