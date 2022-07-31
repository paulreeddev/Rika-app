<template>
  <div class="relative bg-gray-500 rounded-lg bg-opacity-60 border-opacity-60">
    <!-- {{ gif }} -->
    <a :href="gif.gifFilePath" class="hover:opacity-75" target="_new"
      ><img
        class="w-full h-64 object-cover rounded-lg"
        :src="gif.gifFilePath"
        :alt="gif.emoji"
    /></a>
    <div
      v-if="gif.averageRating"
      class="absolute top-0 left-0 backdrop-blur-sm m-2 rounded-lg text-gray-500"
      style="border: 0px solid"
    >
      <div class="flex text-sm rounded-t-lg px-1">
        <span>⭐️</span>
        <span class="text-gray-500">{{
          Number(gif.averageRating.toFixed(1))
        }}</span>
      </div>
    </div>

    <div
      class="absolute bottom-0 right-0 text-lg flex flex-col justify-center p-2"
    >
      {{ gif.emoji }}
    </div>
    <div
      v-if="isLoggedIn"
      class="absolute bottom-0 w-full h-10 flex rounded-b-lg backdrop-blur-sm text-sm justify-between p-2"
    >
      <div>
        <button
          @click="showReportGif = true"
          type="button"
          class="py-1 px-3 text-xs text-gray-500 backdrop-blur-2xl border-2 border-gray-500 rounded-lg"
        >
          Report
        </button>
      </div>
      <div class="flex items-center text-gray-500">
        Rating:
        <star-rating
          class="ml-1"
          :active-color="['blue', 'yellow']"
          :star-size="10"
          @rating-selected="setRating"
          :increment="0.5"
          :rating="gif.rating"
          :border-width="2"
          :show-rating="false"
        />
      </div>
    </div>
    <div
      id="defaultModal"
      tabindex="-1"
      aria-hidden="true"
      :class="{ hidden: !showReportGif }"
      class="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full md:inset-0 h-modal md:h-full"
    >
      <div
        class="relative p-4 w-full max-w-2xl h-full md:h-auto dark:bg-gray-700 bg-gray-300 text-gray-700 dark:text-white rounded-lg shadow"
      >
        <form @submit.prevent="submit">
          <div
            class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Report
            </h3>
            <button
              type="button"
              @click="showReportGif = false"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
            >
              <svg
                aria-hidden="true"
                class="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6 space-y-6">
            <div>
              <div class="mb-6">
                <label
                  for="emoji"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >Report</label
                >
                <textarea
                  id="message"
                  rows="4"
                  v-model="report"
                  required
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Leave a report..."
                ></textarea>
              </div>
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
          >
            <button
              :disabled="isLoading"
              data-modal-toggle="defaultModal"
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <span v-if="isLoading"
                ><svg
                  aria-hidden="true"
                  role="status"
                  class="inline mr-3 w-4 h-4 text-white animate-spin"
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
                Submitting...</span
              >
              <span v-else>Submit</span>
            </button>
            <button
              @click="showReportGif = false"
              data-modal-toggle="defaultModal"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import StarRating from "vue-star-rating";
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: "gif-card",
  props: ["gif"],
  components: {
    StarRating,
  },
  data() {
    return {
      showReportGif: false,
      report: "",
      isLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoggedIn: "getUserStatus",
      user: "getUser",
    }),
  },
  methods: {
    setRating(rating) {
      if (!this.isLoggedIn) {
        return;
      }
      var config = {
        headers: {
          Authorization: "Bearer " + this.user.access_token,
        },
      };
      axios
        .post(
          "api/rateGif",
          {
            reactionGifId: this.gif.id,
            rating: rating,
          },
          config
        )
        .then((res) => {
          console.log(res);
          // this.closeModal();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    submit() {
      this.isLoading = true;
      if (!this.isLoggedIn) {
        return;
      }
      var config = {
        headers: {
          Authorization: "Bearer " + this.user.access_token,
        },
      };

      axios
        .post(
          "api/reportGif",
          {
            reactionGifId: this.gif.id,
            report: this.report,
          },
          config
        )
        .then((res) => {
          console.log(res);
          this.isLoading = false;
          this.showReportGif = false;
          // this.closeModal();
        })
        .catch((err) => {
          console.log(err);
          this.isLoading = false;
        });
    },
  },
};
</script>
