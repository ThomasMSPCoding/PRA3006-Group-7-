OncoMap
---------
Description of project, what it does, aims
Installation and how to use

Sparql Query: 
SELECT DISTINCT ?disease ?diseaseLabel (GROUP_CONCAT(DISTINCT ?symptomLabel; separator=", ") AS ?symptoms) (GROUP_CONCAT(DISTINCT ?treatmentLabel; separator=", ") AS ?treatments) (GROUP_CONCAT(DISTINCT ?locationLabel; separator=", ") AS ?locations)
WHERE {
  VALUES ?disease {wd:Q3658562 wd:Q192102 wd:Q128581 wd:Q181257 wd:Q9303627 wd:Q29496 wd:Q208414 wd:Q3242950 wd:Q623031 wd:Q3242950 wd:Q212961 wd:Q826522 wd:Q18555222 wd:Q18555025}
  #?disease wdt:P279 wd:Q47912.                # Retrieve diseases that are instances of lung cancer
  OPTIONAL { ?disease wdt:P780 ?symptom.      # Retrieve symptoms (P780) if available
             ?symptom rdfs:label ?symptomLabel FILTER(LANG(?symptomLabel) = "en") }
  OPTIONAL { ?disease wdt:P2176 ?treatment.   # Retrieve treatments (P2176) if available
             ?treatment rdfs:label ?treatmentLabel FILTER(LANG(?treatmentLabel) = "en") }
  OPTIONAL { ?disease wdt:P927 ?location.   # Retrieve locations (P927) if available
             ?location rdfs:label ?locationLabel FILTER(LANG(?locationLabel) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
GROUP BY ?disease ?diseaseLabel
ORDER BY ?diseaseLabel
