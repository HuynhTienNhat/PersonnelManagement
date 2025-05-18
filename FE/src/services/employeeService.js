const API_BASE_URL = 'http://localhost:5000/api/employees'; // Đổi lại nếu khác

export async function getAllEmployees() {
  const res = await fetch("/api/employees");
  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}

export async function deleteEmployee(id) {
  const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete employee");
  return res.json();
}

export async function searchEmployeesByName(name) {
  const res = await fetch(`/api/employees?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Failed to search employees by name");
  return res.json();
}

export async function filterEmployeesByDepartment(department) {
  const res = await fetch(`/api/employees?department=${encodeURIComponent(department)}`);
  if (!res.ok) throw new Error("Failed to filter employees by department");
  return res.json();
}

export async function filterEmployeesByPosition(position) {
  const res = await fetch(`/api/employees?position=${encodeURIComponent(position)}`);
  if (!res.ok) throw new Error("Failed to filter employees by position");
  return res.json();
}
export async function updateEmployee(id, employeeData) {
  const res = await fetch(`/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return res.json();
}
