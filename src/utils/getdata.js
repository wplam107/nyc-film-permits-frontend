import { collection, getDocs, query, where, orderBy, limit, startAt, startAfter } from "firebase/firestore";
import { LIMIT } from "../configurations";

async function getData(db, country, category, sortOrder, inclusive, cursor) {
  if ((country == null) || (category == null)){
    return [null, []];
  }
  const streetsRef = collection(db, "permits");
  let q;
  if ((category === "ALL") && (country === "ALL")) {
    if (inclusive === "Yes") {
      q = query(
        streetsRef,
        orderBy("startdate", sortOrder),
        startAt(cursor),
        limit(LIMIT)
      );
    } else if (inclusive === "No") {
      q = query(
        streetsRef,
        orderBy("startdate", sortOrder),
        startAfter(cursor),
        limit(LIMIT)
      );
    } else {
      q = query(
        streetsRef,
        orderBy("startdate", sortOrder),
        limit(LIMIT)
      );
    }
  } else if (country === "ALL") {
    if (inclusive === "Yes") {
      q = query(
        streetsRef,
        where("catgory", "==", category),
        orderBy("startdate", sortOrder),
        startAt(cursor),
        limit(LIMIT)
      );
    } else if (inclusive === "No") {
      q = query(
        streetsRef,
        where("catgory", "==", category),
        orderBy("startdate", sortOrder),
        startAfter(cursor),
        limit(LIMIT)
      );
    } else {
      q = query(
        streetsRef,
        where("catgory", "==", category),
        orderBy("startdate", sortOrder),
        limit(LIMIT)
      );
    }
  } else if (category === "ALL") {
    if (inclusive === "Yes") {
      q = query(
        streetsRef,
        where("country", "==", country),
        orderBy("startdate", sortOrder),
        startAt(cursor),
        limit(LIMIT)
      );
    } else if (inclusive === "No") {
      q = query(
        streetsRef,
        where("country", "==", country),
        orderBy("startdate", sortOrder),
        startAfter(cursor),
        limit(LIMIT)
      );
    } else {
      q = query(
        streetsRef,
        where("country", "==", country),
        orderBy("startdate", sortOrder),
        limit(LIMIT)
      );
    }
  } else {
    if (inclusive === "Yes") {
      q = query(
        streetsRef,
        where("country", "==", country),
        where("category", "==", category),
        orderBy("startdate", sortOrder),
        startAt(cursor),
        limit(LIMIT)
      );
    } else if (inclusive === "No") {
      q = query(
        streetsRef,
        where("country", "==", country),
        where("category", "==", category),
        orderBy("startdate", sortOrder),
        startAfter(cursor),
        limit(LIMIT)
      );
    } else {
      q = query(
        streetsRef,
        where("country", "==", country),
        where("category", "==", category),
        orderBy("startdate", sortOrder),
        limit(LIMIT)
      );
    }
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
          "properties": {"mag": 0.2, "eventid": docData["eventid"]},
          "geometry": geom
        };
        sData["features"].push(feature);
      };
    });
    const allData = [sData, pData, querySnapshot.docs[0], querySnapshot.docs[querySnapshot.docs.length-1]];
    return allData;
  } else {
    return [null, []];
  }
}

export default getData;