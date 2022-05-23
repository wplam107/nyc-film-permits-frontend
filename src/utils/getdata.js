import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

async function getData(db, country, category, sortOrder) {
  if ((country == null) || (category == null)){
    return [null, []];
  }
  const streetsRef = collection(db, "permits");
  let q;
  if ((category === "ALL") && (country === "ALL")) {
    q = query(
      streetsRef,
      orderBy("startdate", sortOrder),
      limit(1000)
    );
  } else if (country === "ALL") {
    q = query(
      streetsRef,
      where("catgory", "==", category),
      orderBy("startdate", sortOrder),
      limit(1000)
    );
  } else if (category === "ALL") {
    q = query(
      streetsRef,
      where("country", "==", country),
      orderBy("startdate", sortOrder),
      limit(1000)
    );
  } else {
    q = query(
      streetsRef,
      where("country", "==", country),
      where("category", "==", category),
      orderBy("startdate", sortOrder),
      limit(1000)
    );
  }
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const sData = {
      "type": "FeatureCollection",
      "features": []
    };
    const pData = [];
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const jsonString = docData["geoms"]["features"][0]["geometry"];
      const pDatum = {
        "Event ID": docData["eventid"],
        "Start Date": docData["startdate"],
        "End Date": docData["enddate"],
        "Category": docData["category"],
        "Subcategory": docData["subcategory"],
        "Country": docData["country"],
        "Streets Found": jsonString === "None" ? "No" : "Yes",
      };
      pData.push(pDatum);
      
      if (jsonString !== "None") {
        const geom = (0, eval)('(' + jsonString + ')');
        const feature = {
          "type": "Feature",
          "properties": {"mag": 0.2},
          "geometry": geom
        };
        sData["features"].push(feature);
      };
    });
    const allData = Array(sData, pData);
    return allData;
  } else {
    return [null, []];
  }
}

export default getData;