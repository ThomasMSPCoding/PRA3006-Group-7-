OncoMap
---------
PRA3006 Programming in the Life Sciences Project on an interactive body map showcasing most common types of cancers. 
more description
add instructions 
greatly detailed documentation

- authors
- license

Second Query:
SELECT ?symptom ?symptomLabel ?article WHERE {
    VALUES ?symptom {wd:Q3480107}
    ?symptom rdfs:label ?symptomLabel FILTER(LANG(?symptomLabel) = "en") 
      OPTIONAL {
      ?article schema:about ?symptom .
      ?article schema:inLanguage "en" .
      FILTER (SUBSTR(str(?article), 1, 25) = "https://en.wikipedia.org/")
    }
} 
To do for this: 
{wd:Q3480107} to be exchanged with symptomsQ data from original query
add as table to additional info page, with symptomLabel and article - going to be a table with just two columns, symptom and link to wikipedia page 
