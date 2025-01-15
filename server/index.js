import "dotenv/config";
import express from "express";
import { drizzle } from "drizzle-orm/node-postgres";
import { owner, visitors, visits } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import moment from "moment";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Hello");
  res.send("Hells");
});
const db = drizzle(process.env.DB_URL);

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
      .send({ error: "Error fetching flat details", details: error.message });
  }
});

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

app.post("/api/visit", async (req, res) => {
  try {
    const { name, new_mobile_number, flat_number, reason } = req.body;
    let global_visitor_id;
    const vst = await db
      .select({
        id: visitors.id,
        name: visitors.name,
      })
      .from(visitors)
      .where(eq(visitors.mobileNumber, new_mobile_number));

    console.log(vst);

    global_visitor_id = vst?.at(0)?.id;

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

    console.log(global_visitor_id);

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
      .send({ error: "Error fetching visit details", details: error.message });
  }
});

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
      res.status(200).send(result)
  } catch (error) {
    res
      .status(500)
      .send({ error: "Error fetching all_visitors details", details: error.message });
  }
});

app.listen(3000, () => {
  console.log("Listening port 3000");
});
