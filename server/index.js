import "dotenv/config";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { owner, visitors, visits } from "./drizzle/schema.js";
import { and, eq, ilike } from "drizzle-orm";
import moment from "moment";

const app = express();

app.use(express.json());

const db = drizzle(process.env.DB_URL);

// '/' route
app.get("/", (req, res) => {
  console.log("Hello");
  res.send("Hello");
});

// Get the details of a flat
app.get("/api/flat/:flat_id", async (req, res) => {
  try {
    const { flat_id } = req.params;
    const allOwners = await db
      .select({
        name: owner.name,
        mobile: owner.mobileNumber,
        flat_number: owner.flatNumber,
      })
      .from(owner)
      .where(eq(owner.flatNumber, flat_id));
    res.status(200).send(allOwners);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching flat details", details: error.message });
  }
});

// Add a new flat
app.post("/api/flat", async (req, res) => {
  try {
    const { name, mobile_number, flat_number } = req.body;
    const added_owner = await db
      .insert(owner)
      .values({
        name: name,
        mobileNumber: mobile_number,
        flatNumber: flat_number,
      })
      .returning();
    res.status(200).send(added_owner);
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error posting flat details", details: error.message });
  }
});

// Add a new entry in visitor table (NO USE)
app.post("/api/visitor", async (req, res) => {
  try {
    const { name, mobile_number } = req.body;
    const visitor = await db
      .insert(visitors)
      .values({
        name: name,
        mobileNumber: mobile_number,
      })
      .returning();
    res.status(200).send(visitor);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching visitor details",
      details: error.message,
    });
  }
});

// Add a new entry @ gate  ---> For security
app.post("/api/visit", async (req, res) => {
  try {
    console.log(req.body);
    const { name, new_mobile_number, flat_number, reason } = req.body;
    console.log(
      "Inside index.js: \n",
      name,
      new_mobile_number,
      flat_number,
      reason
    );
    let global_visitor_id;

    // First check if the visitor already exists by verifying mobile number
    const vst = await db
      .select({
        id: visitors.id,
        name: visitors.name,
      })
      .from(visitors)
      .where(eq(visitors.mobileNumber, new_mobile_number));

    console.log(vst);

    global_visitor_id = vst?.at(0)?.id;

    // If the visitor is totally new, first add him to visitors table then to visits table
    if (vst.length == 0) {
      const visitor = await db
        .insert(visitors)
        .values({
          name: name,
          mobileNumber: new_mobile_number,
        })
        .returning({
          id: visitors.id,
        });
      global_visitor_id = visitor[0].id;
    }

    // console.log(global_visitor_id);

    const final_vst = await db
      .insert(visits)
      .values({
        visitorId: global_visitor_id,
        flatId: flat_number,
        reason: reason,
      })
      .returning();

    res.status(201).send(
      final_vst.map((x) => ({
        ...x,
        entryTime: moment(x.entryTime).format("DD MMM YYYY, hh:mm A"),
      }))
    );
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error posting visit details", details: error.message });
  }
});

// Get details of all the visitors ---> For security
app.get("/api/all_visitors", async (req, res) => {
  try {
    const result = await db
      .select({
        flatNumber: owner.flatNumber,
        visitorName: visitors.name,
        visitReason: visits.reason,
        visitorMobile: visitors.mobileNumber,
        entryTime: visits.entryTime,
      })
      .from(owner)
      .innerJoin(visits, eq(owner.flatNumber, visits.flatId))
      .innerJoin(visitors, eq(visitors.id, visits.visitorId));
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching all_visitors details",
      details: error.message,
    });
  }
});

// Get all the visitors visited to a flat ---> For Admin
app.get("/api/visitors_of_flat/:flat_num", async (req, res) => {
  try {
    const { flat_num } = req.params;
    const result = await db
      .select({
        vis_id: visitors.id,
        vis_name: visitors.name,
        vis_mobile: visitors.mobileNumber,
        vis_reason: visits.reason,
        vis_entry: visits.entryTime,
        vis_exit: visits.exitTime,
      })
      .from(visits)
      .innerJoin(owner, eq(owner.flatNumber, visits.flatId))
      .where(eq(owner.flatNumber, flat_num))
      .innerJoin(visitors, eq(visits.visitorId, visitors.id));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({
      error: "Error fetching visitors_of_flat details",
      details: error.message,
    });
  }
});

app.get("/api/search", async (req, res) => {
  const { name, flat_num } = req.query;
  console.log(name, flat_num);
  if (!name) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const results = await db
      .select({
        vis_id: visitors.id,
        vis_name: visitors.name,
        vis_mobile: visitors.mobileNumber,
        vis_reason: visits.reason,
        vis_entry: visits.entryTime,
        vis_exit: visits.exitTime,
      })
      .from(visits)
      .innerJoin(owner, eq(owner.flatNumber, visits.flatId))
      .innerJoin(visitors, eq(visits.visitorId, visitors.id))
      .where(
        and(ilike(visitors.name, `%${name}%`), eq(owner.flatNumber, flat_num))
      )
      .limit(10);

    res.json(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(3000, () => {
  console.log("Listening port 3000");
});
