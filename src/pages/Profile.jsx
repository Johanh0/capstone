import { useEffect, useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import { HiOutlineLogout } from "react-icons/hi";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const [profileData, setProfileData] = useState({});

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...profileData });
  const fileInputRef = useRef(null);

  // Handle edit form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email } = editFormData;
    const { role, id } = user;

    console.log(firstName, lastName, email, role, id);

    try {
      const response = await fetch("/api/v1/user/update_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, role, id }),
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error trying to update user");
      }

      const data = await response.json();
      setUser(data);
      setProfileData(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
      alert(error.message);
    }
  };

  // Handle photo upload button click
  const handlePhotoButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  // Handle file selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a JPG or PNG file");
      return;
    }

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", user.id);

      // Send the file to the server
      const response = await fetch("/api/v1/user/upload", {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error uploading image");
      }

      const data = await response.json();

      // Update the profile data with the new image URL
      setProfileData({
        ...profileData,
        profile_image_url: data.user.profile_image_url,
      });

      setEditFormData({
        ...editFormData,
        profile_image_url: data.user.profile_image_url,
      });

      // Update user context if needed
      setUser({
        ...user,
        profile_image_url: data.user.profile_image_url,
      });

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        credentials: "include",
      });

      setUser(null);
      navigate("/");
    } catch (error) {}
  };

  useEffect(() => {
    const isUserLoggedIn = async () => {
      try {
        const response = await fetch("/api/v1/user/profile", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("User is not logged in");
        }
        const data = await response.json();

        setUser(data);
        setProfileData(data);
        setEditFormData(data);
      } catch (error) {
        navigate("/auth");
        throw new Error(error);
      }
    };

    isUserLoggedIn();
  }, []);
  return (
    <>
      <section className="flex justify-center h-full w-full items-center">
        <div className="w-3xl mx-auto p-6">
          <div className="flex items-center mb-8">
            <div className="relative mr-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-[2px] border-gray-200">
                <img
                  src={`/${profileData?.profile_image_url}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mb-2"
                onClick={handlePhotoButtonClick}
              >
                Upload new photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Personal Info
              </h2>
              {!isEditing && (
                <button
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => setIsEditing(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </button>
              )}
            </div>

            {!isEditing ? (
              // View mode
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium">
                    {profileData?.firstName} {profileData?.lastName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{profileData?.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-medium capitalize">{profileData?.role}</p>
                </div>

                <div
                  onClick={handleLogout}
                  className="w-fit text-lg bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
                >
                  <button className="flex items-center gap-3 px-5 py-2 ">
                    <p>Logout</p>
                    <HiOutlineLogout />
                  </button>
                </div>
              </div>
            ) : (
              // Edit mode
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm text-gray-500 mb-1"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={editFormData.role}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="Volunteer">Volunteer</option>
                      <option value="Help Requested">Help Requested</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditFormData({
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        email: user?.email,
                        role: user?.role,
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
