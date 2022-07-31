<template>
  <div class="w-screen h-screen flex flex-col overflow-hidden">
    <div
      class="flex w-full h-full overflow-hidden overflow-y-auto p-2 justify-center dark:bg-gray-900 bg-gray-300 text-gray-900 dark:text-white"
    >
      <div class="flex flex-col h-full w-full max-w-5xl">
        <div class="h-full pb-16">
          <div class="flex justify-between items-center p-2">
            <div class="relative">
              <div
                class="flex items-center cursor-pointer"
                v-if="isLoggedIn"
                @click="showProfileMenu = true"
              >
                <div
                  class="h-8 w-8 rounded-full bg-red-300 flex justify-center items-center"
                ></div>
                <div class="ml-2">{{ username }}</div>
                <button
                  @click="triggerNetlifyIdentityAction('logout')"
                  type="button"
                  class="ml-2 py-2 px-3 text-xs text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
            <button
              @click="contribute()"
              type="button"
              class="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
            >
              Contribute
            </button>

            <!-- <div>Contribute</div> -->
          </div>
          <div class="flex justify-center">
            <div class="max-w-xl w-full p-5">
              <router-link to="/">
                <div class="my-3 flex justify-center items-center">
                  Emoji Reaction
                  <span
                    class="ml-2 bg-gray-900 dark:bg-gray-300 dark:text-gray-900 text-white rounded-full p-2 py-0"
                    >gifs</span
                  >
                </div>
              </router-link>
              <form class="w-full" v-on:submit.prevent="search">
                <div class="relative">
                  <div
                    class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
                  >
                    <svg
                      aria-hidden="true"
                      class="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="search"
                    v-model="searchTerm"
                    @change="search"
                    id="default-search"
                    class="block p-4 pl-10 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search gifs using emoji..."
                    required
                  />
                  <button
                    type="submit"
                    :disabled="isGifsLoading"
                    class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      v-if="isGifsLoading"
                      aria-hidden="true"
                      role="status"
                      class="inline mr-1 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Search</span>
                  </button>
                </div>
              </form>
              <div class="text-sm flex py-1">Popular searchs 😀</div>
              <!-- <button
            type="button"
            class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2"
          >
            <svg
              class="mr-2 -ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            Add gif
          </button> -->
            </div>
          </div>
          <router-view />
        </div>
      </div>
    </div>
    <footer class="text-gray-600 body-font bg-gray-900">
      <div
        class="container py-2 mx-auto flex items-center sm:flex-row flex-col"
      >
        <p class="text-sm dark:text-gray-200 text-gray-900">
          Inspired by
          <a href="https://hashnode.com/" class="text-blue-300">hasnode's </a>
          hackton with
          <a href="https://planetscale.com/" class="text-blue-300"
            >planet scale</a
          >
        </p>
        <a href="https://hashnode.com/" class="text-blue-900">
          <img
            src="./assets/GitHub-Mark-Light-32px.png"
            class="ml-10"
            height="20"
            width="20"
          />
        </a>
      </div>
    </footer>
    <div
      id="defaultModal"
      tabindex="-1"
      aria-hidden="true"
      :class="{ hidden: !showContributeModal }"
      class="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    >
      <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <!-- Modal content -->
        <contribute :closeModal="closeModal" />
      </div>
    </div>
  </div>
</template>
<script>
import netlifyIdentity from "netlify-identity-widget";
import { mapActions, mapGetters } from "vuex";
import Contribute from "./components/Contribute.vue";

netlifyIdentity.init({
  APIUrl: "https://emoji-reaction-gifs.netlify.app/.netlify/identity",
  logo: true, // you can try false and see what happens
});

export default {
  name: "App",
  components: {
    Contribute,
  },
  created() {
    this.searchTerm = this.$route.query.q;
    if (this.searchTerm) {
      this.getReactionGifs(this.searchTerm);
    }
  },
  data() {
    return {
      searchTerm: "",
      currentUser: null,
      showProfileMenu: false,
      showContributeModal: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "getUserStatus",
      user: "getUser",
      isGifsLoading: "getIsGifsLoading",
    }),
    username() {
      return this.user ? this.user.username : "";
    },
  },
  methods: {
    ...mapActions(["updateUser", "getReactionGifs"]),
    search() {
      this.$router
        .push({ name: "search", query: { q: this.searchTerm } })
        .catch((err) => {
          // console.log(err);
        });
      this.getReactionGifs(this.searchTerm);
    },
    contribute() {
      if (this.user) {
        this.showContributeModal = true;
      } else {
        this.triggerNetlifyIdentityAction("login");
      }
    },
    closeModal() {
      this.showContributeModal = false;
    },
    addMenuOutsideClicked() {
      if (Date.now() - this.addMenuTimeUp > 300) {
        this.showProfileMenu = false;
      }
    },
    triggerNetlifyIdentityAction(action) {
      if (action == "login" || action == "signup") {
        netlifyIdentity.open(action);
        netlifyIdentity.on(action, (user) => {
          this.currentUser = {
            username: user.user_metadata.full_name,
            email: user.email,
            access_token: user.token.access_token,
            expires_at: user.token.expires_at,
            refresh_token: user.token.refresh_token,
            token_type: user.token.token_type,
          };
          this.updateUser({
            currentUser: this.currentUser,
          });
          this.showContributeModal = true;
          netlifyIdentity.close();
        });
      } else if (action == "logout") {
        this.currentUser = null;
        this.updateUser({
          currentUser: this.currentUser,
        });
        netlifyIdentity.logout();
        this.showProfileMenu = false;
      }
    },
  },
};
</script>
<style>
* {
  font-family: "Inter", sans-serif;
}
</style>
