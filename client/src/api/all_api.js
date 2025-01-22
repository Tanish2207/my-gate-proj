export const get_owner = async (flatNumber) => {
  try {
    const response = await fetch(`/api/flat/${flatNumber}`, {
      method: "GET",
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      return { error: "No owner found for this day" };
    } else {
      return { error: "An unexpected error occurred" };
    }
  } catch (error) {
    console.error("Error fetching owner:", error);
    return { error: "An error occurred while fetching owner" };
  }
};

export const add_visitor = async (new_visitor) => {
  try {
    const { vis_name, vis_flat_num, vis_mobile, vis_reason } = new_visitor;
    console.log("daffas", new_visitor);
    const response = await fetch(`/api/visit`, {
      method: "POST",
      body: JSON.stringify({
        name: vis_name,
        new_mobile_number: vis_mobile,
        flat_number: vis_flat_num,
        reason: vis_reason,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return response.json();
    } else {
      console.log(response);
      return { error: "An unexpected error occurred" };
    }
  } catch (error) {
    console.error("Error adding visitor:", error);
    return { error: "An error occurred while adding visitor" };
  }
};

export const add_flat = async (new_flat) => {
  try {
    const { name, mobile_number, flat_number } = new_flat;
    const response = await fetch(`/api/flat`, {
      method: "POST",
      body: JSON.stringify({
        name: name,
        mobile_number: mobile_number,
        flat_number: flat_number,
      }),
    });
    if (response.status === 200) {
      return response.json();
    } else {
      return { error: "An unexpected error occurred" };
    }
  } catch (error) {
    console.error("Error adding flat:", error);
    return { error: "An error occurred while adding flat" };
  }
};

export const get_flat_wise_visitor = async (flat_num) => {
  try {
    const response = await fetch(`/api/visitors_of_flat/${flat_num}`, {
      method: "GET",
    });

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      return { error: "No visitor found" };
    } else {
      return { error: "An unexpected error occurred" };
    }
  } catch (error) {
    console.error("Error getting get_flat_wise_visitor:", error);
    return { error: "An error occurred while getting flat visitors" };
  }
};

export const search_name = async (query_name, flat_num) => {
  try {
    const response = await fetch(
      `/api/search?name=${query_name}&flat_num=${flat_num}`,
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      return response.json();
    } else if (response.status === 404) {
      return { error: "No name found" };
    } else {
      return { error: "An unexpected error occured" };
    }
  } catch (error) {
    console.error("Error searching name:", error);
    return { error: "An error occurred while searching name" };
  }
};
