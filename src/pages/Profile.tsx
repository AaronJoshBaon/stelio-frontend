import { useEffect, useState } from "react";
import { getProfile, uploadProfilePicture } from "../api/user";

const Profile = () => {
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] =
    useState<boolean>(false);
  const [changePhoto, setChangePhoto] = useState<boolean>(false);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>({});
  const [activities, setActivities] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    city: "",
  });

  const initials =
    `${userInfo?.firstname?.[0] ?? ""}${userInfo?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "??";

  const joinedDate = userInfo?.joinedAt
    ? new Date(userInfo.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const handleSaveChangePhoto = async () => {
    if (!newProfilePicture) {
      return;
    }

    setIsUploading(true);

    try {
      const res = await uploadProfilePicture(newProfilePicture);

      if (res?.success) {
        setChangePhoto(false);
        setNewProfilePicture(null);
        setPreview(null);
        if (res.profileLink) {
          setUserInfo((prev: any) => ({ ...prev, profileLink: res.profileLink }));
        }
      }
    } finally {
      // Always release the uploading lock so the action buttons never stay
      // permanently disabled on a subsequent photo change (or on failure).
      setIsUploading(false);
    }
  };

  const handleOpenEditInfo = () => {
    setEditForm({
      firstname: userInfo?.firstname ?? "",
      lastName: userInfo?.lastName ?? "",
      email: userInfo?.email ?? "",
      phoneNumber: userInfo?.phoneNumber ?? "",
      city: userInfo?.city ?? "",
    });
    setIsEditingPersonalInfo(true);
  };

  const handleSaveInfo = () => {
    setUserInfo((prev: any) => ({ ...prev, ...editForm }));
    setIsEditingPersonalInfo(false);
  };

  const handleCancelChangePhoto = () => {
    setChangePhoto(!changePhoto);
    setNewProfilePicture(null);
    setPreview(null);
  };

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      if (res.success) {
        setUserInfo(res.userDetails);
        setActivities(res.activities);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!newProfilePicture) return;

    const url = URL.createObjectURL(newProfilePicture);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [newProfilePicture]);

  return (
    <div className="bg-dark-800 min-h-screen overflow-y-auto page-enter">
      <div className="max-w-[920px] mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {isLoading ? (
          /* ── Skeleton loading ── */
          <div role="status" className="animate-pulse">
            <div className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden mb-6">
              <div className="px-6 py-5 flex items-end gap-4">
                <div className="skel-block w-[72px] h-[72px] rounded-2xl flex-shrink-0" />
                <div className="flex-1 mb-1">
                  <div className="skel-block h-5 w-40 rounded mb-2" />
                  <div className="skel-block h-3 w-64 rounded" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
              <div className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                  <div className="skel-block h-4 w-40 rounded mb-1.5" />
                  <div className="skel-block h-3 w-28 rounded" />
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={i === 2 ? "sm:col-span-2" : ""}>
                      <div className="skel-block h-3 w-20 rounded mb-2" />
                      <div className="skel-block h-4 w-full rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden h-fit">
                <div className="px-5 py-4 border-b border-white/[0.06]">
                  <div className="skel-block h-4 w-24 rounded mb-1.5" />
                  <div className="skel-block h-3 w-28 rounded" />
                </div>
                <div className="p-5 flex flex-col gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between py-2">
                      <div className="skel-block h-3 w-28 rounded" />
                      <div className="skel-block h-3 w-10 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ── Profile Hero ── */}
            <div className="relative bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden mb-6 animate-fadeInUp">
              <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  {/* Avatar */}
                  <div
                    className="relative w-[72px] h-[72px] rounded-2xl flex-shrink-0 cursor-pointer group hover-scale"
                    onClick={() =>
                      !changePhoto &&
                      document.getElementById("avatar-input")?.click()
                    }
                  >
                    {/* Image or initials */}
                    <div
                      className="w-full h-full rounded-2xl flex items-center justify-center text-dark-900 font-semibold font-serif text-[22px] border-[3px] border-dark-700 overflow-hidden ring-2 ring-transparent group-hover:ring-gold/50 transition-all duration-300 bg-gradient-to-br from-gold to-gold-dark"
                    >
                      {newProfilePicture || userInfo?.profileLink ? (
                        <img
                          src={preview || userInfo.profileLink}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 pointer-events-none">
                      <svg width="16" height="16" viewBox="0 0 13 13" fill="none">
                        <path
                          d="M1.5 4.5C1.5 3.95 1.95 3.5 2.5 3.5H3.5L4.5 2H8.5L9.5 3.5H10.5C11.05 3.5 11.5 3.95 11.5 4.5V10C11.5 10.55 11.05 11 10.5 11H2.5C1.95 11 1.5 10.55 1.5 10V4.5Z"
                          stroke="white"
                          strokeWidth="1.1"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="6.5"
                          cy="7"
                          r="1.8"
                          stroke="white"
                          strokeWidth="1.1"
                        />
                      </svg>
                      <span className="text-white text-[9px] tracking-wide">
                        change
                      </span>
                    </div>

                    {/* Online dot */}
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-dark-700 z-10" />

                    {/* Hidden file input */}
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setNewProfilePicture(file);
                        setChangePhoto(true);
                        e.target.value = "";
                      }}
                    />
                  </div>

                  {/* Name + meta */}
                  <div className="mb-1">
                    <h2 className="text-[20px] font-medium font-serif text-primary leading-tight">
                      {userInfo?.firstname} {userInfo?.lastName}
                    </h2>
                    <p className="text-[12px] text-muted-faint mt-[3px]">
                      {userInfo?.email}
                      <span className="mx-1.5 text-muted-ghost">·</span>
                      Member since {joinedDate}
                    </p>
                  </div>
                </div>
                {/* Confirmation bar */}
                {changePhoto && (
                  <div
                    className="mb-1 flex flex-wrap items-center gap-2 w-full sm:w-auto bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2"
                    style={{
                      animation:
                        "confirmSlideIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
                    }}
                  >
                    {/* Pick different */}
                    <label className="flex items-center gap-1 text-[11px] text-muted-faint border border-white/[0.1] rounded-lg px-2.5 py-1.5 hover:bg-white/[0.06] hover:text-primary transition-all cursor-pointer">
                      Change
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setNewProfilePicture(file);
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={handleCancelChangePhoto}
                      className="items-center gap-1 text-[11px] text-muted-faint border border-white/[0.1] rounded-lg px-2.5 py-1.5 hover:bg-white/[0.06] hover:text-primary transition-all cursor-pointer"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>

                    {/* Save */}
                    <button
                      type="button"
                      onClick={handleSaveChangePhoto}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-dark-900 bg-gold border-none hover:bg-gold-light transition-colors rounded-lg px-3 py-1.5 cursor-pointer btn-press"
                      disabled={isUploading}
                    >
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6.5L4.5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {isUploading ? "Saving...." : "Save"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 stagger-children">
              {/* ── LEFT: Personal Information ── */}
              <div className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <div>
                    <h3 className="text-[14px] font-medium text-primary">
                      Personal Information
                    </h3>
                    <p className="text-[11px] text-muted-faint mt-0.5">
                      {isEditingPersonalInfo
                        ? "Update your details below"
                        : "Your account details"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      isEditingPersonalInfo
                        ? setIsEditingPersonalInfo(false)
                        : handleOpenEditInfo()
                    }
                    className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border cursor-pointer transition-all btn-press ${
                      isEditingPersonalInfo
                        ? "text-muted-faint border-white/[0.1] bg-white/[0.04] hover:bg-white/[0.08]"
                        : "text-gold border-gold/30 bg-gold/[0.08] hover:bg-gold/[0.14]"
                    }`}
                  >
                    {isEditingPersonalInfo ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="p-6">
                  {isEditingPersonalInfo ? (
                    /* ── Edit mode ── */
                    <div className="animate-fadeInUp">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] text-muted-faint uppercase tracking-[0.07em] mb-1.5">
                            First name
                          </label>
                          <input
                            className="s-input w-full bg-dark-900 border border-white/[0.1] rounded-xl px-4 py-3 text-primary text-[13px] font-sans transition-colors"
                            value={editForm.firstname}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                firstname: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-muted-faint uppercase tracking-[0.07em] mb-1.5">
                            Last name
                          </label>
                          <input
                            className="s-input w-full bg-dark-900 border border-white/[0.1] rounded-xl px-4 py-3 text-primary text-[13px] font-sans transition-colors"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] text-muted-faint uppercase tracking-[0.07em] mb-1.5">
                            Email address
                          </label>
                          <input
                            className="s-input w-full bg-dark-900 border border-white/[0.1] rounded-xl px-4 py-3 text-primary text-[13px] font-sans transition-colors"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-muted-faint uppercase tracking-[0.07em] mb-1.5">
                            Phone number
                          </label>
                          <input
                            className="s-input w-full bg-dark-900 border border-white/[0.1] rounded-xl px-4 py-3 text-primary text-[13px] font-sans transition-colors"
                            value={editForm.phoneNumber}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                phoneNumber: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-muted-faint uppercase tracking-[0.07em] mb-1.5">
                            City
                          </label>
                          <input
                            className="s-input w-full bg-dark-900 border border-white/[0.1] rounded-xl px-4 py-3 text-primary text-[13px] font-sans transition-colors"
                            value={editForm.city}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, city: e.target.value }))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-end mt-5 pt-4 border-t border-white/[0.06]">
                        <button
                          type="button"
                          onClick={handleSaveInfo}
                          className="bg-gold text-dark-900 border-none rounded-xl px-6 py-2.5 text-[13px] font-semibold cursor-pointer hover:bg-gold-light transition-colors btn-press relative overflow-hidden shine"
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── View mode ── */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 stagger-children animate-fadeInUp">
                      {[
                        {
                          label: "First name",
                          value: userInfo?.firstname,
                          span: false,
                        },
                        {
                          label: "Last name",
                          value: userInfo?.lastName,
                          span: false,
                        },
                        {
                          label: "Email address",
                          value: userInfo?.email,
                          span: true,
                        },
                        {
                          label: "Phone number",
                          value: userInfo?.phoneNumber,
                          span: false,
                        },
                        { label: "City", value: userInfo?.city, span: false },
                      ].map(({ label, value, span }) => (
                        <div key={label} className={span ? "sm:col-span-2" : ""}>
                          <div className="text-[11px] text-muted-faint uppercase tracking-[0.07em] mb-1">
                            {label}
                          </div>
                          <div className="text-[13px] font-medium text-primary">
                            {value || (
                              <span className="text-muted-ghost italic font-normal">
                                Not set
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT: Activity ── */}
              <div className="bg-dark-700 border border-white/[0.07] rounded-2xl overflow-hidden h-fit">
                {/* Card header */}
                <div className="px-5 py-4 border-b border-white/[0.06]">
                  <h3 className="text-[14px] font-medium text-primary">
                    Activity
                  </h3>
                  <p className="text-[11px] text-muted-faint mt-0.5">
                    Your stay history
                  </p>
                </div>

                <div className="p-5 flex flex-col gap-0 stagger-children">
                  {[
                    {
                      label: "Bookings made",
                      value: activities?.bookingsMade,
                      gold: false,
                    },
                    {
                      label: "Nights stayed",
                      value: activities?.nightStayed,
                      gold: false,
                    },
                    {
                      label: "Upcoming stays",
                      value: activities?.upcomingStays,
                      gold: true,
                    },
                    {
                      label: "Reviews given",
                      value: activities?.reviewsGiven,
                      gold: false,
                    },
                  ].map(({ label, value, gold }, i, arr) => (
                    <div
                      key={label}
                      className={`flex items-center justify-between py-3 ${
                        i < arr.length - 1 ? "border-b border-white/[0.05]" : ""
                      }`}
                    >
                      <span className="text-[12px] text-muted-faint">{label}</span>
                      <span
                        className={`text-[13px] font-medium tabular-nums ${
                          gold ? "text-gold" : "text-primary"
                        }`}
                      >
                        {value ?? "—"}
                      </span>
                    </div>
                  ))}

                  {/* Total spent */}
                  <div className="mt-3 pt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[12px] text-muted-faint">
                      Total spent
                    </span>
                    <span className="text-[18px] text-gold tabular-nums font-serif">
                      ₱{activities?.totalSpent?.toLocaleString() ?? "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
