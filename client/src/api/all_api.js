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