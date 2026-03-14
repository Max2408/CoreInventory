const forgotLink = document.getElementById("forgotLink");
const signupLink = document.getElementById("signupLink");
const forgotModal = document.getElementById("forgotModal");
const signupModal = document.getElementById("signupModal");
const closeForgot = document.getElementById("closeForgot");
const closeSignup = document.getElementById("closeSignup");

forgotLink.onclick = () => forgotModal.style.display = "block";
signupLink.onclick = () => signupModal.style.display = "block";

closeForgot.onclick = () => forgotModal.style.display = "none";
closeSignup.onclick = () => signupModal.style.display = "none";

window.onclick = (event) => {
  if (event.target === forgotModal) forgotModal.style.display = "none";
  if (event.target === signupModal) signupModal.style.display = "none";
};
