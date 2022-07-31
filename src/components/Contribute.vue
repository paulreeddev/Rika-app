<template>
  <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
    <!-- Modal header -->
    <form @submit.prevent="submit" ref="contributeForm">
      <div
        class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"
      >
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Contribute
        </h3>
        <button
          type="button"
          @click="closeModal"
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
              >Your emoji</label
            >
            <input
              type="text"
              id="emoji"
              v-model="emoji"
              name="emoji"
              @keyup="validateEmoji"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="😀"
              required
            />
            <p
              class="mt-2 text-xs text-red-600 dark:text-red-300"
              v-if="emojiError"
            >
              {{ emojiError }}
            </p>
          </div>

          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            for="file_input"
            >Upload gif</label
          >
          <input
            class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            accept=".gif"
            name="gif"
            type="file"
          />
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
          @click="closeModal"
          data-modal-toggle="defaultModal"
          type="button"
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
        >
          Close
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters } from "vuex";
export default {
  name: "contribute",
  props: ["closeModal"],
  data() {
    return {
      emoji: "",
      emojiError: "",
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
    submit() {
      var form = this.$refs["contributeForm"];
      var formData = new FormData();
      const data = {};
      [...form.elements].forEach(({ name, type, value, files, ...element }) => {
        if (!["submit", "file", "button"].includes(type)) {
          data[name] = value;
        } else if (type === "file") {
          [...files].forEach((file) => {
            formData.append(`files.${name}`, file, file.name);
          });
        }
      });

      formData.append("data", JSON.stringify(data));
      for (var key of formData.entries()) {
        console.log(key[0] + ", " + key[1]);
      }
      var config = {
        headers: {
          "content-type": "multipart/form-data; charset=utf-8",
          Authorization: "Bearer " + this.user.access_token,
        },
      };
      this.isLoading = true;
      axios
        .post("api/createReactionGifs", formData, config)
        .then((res) => {
          this.isLoading = false;
          this.closeModal();
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    validateEmoji() {
      console.log("this.emoji", this.emoji);
      let pattern =
        /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;

      let result = this.emoji.match(pattern);
      console.log("result", result);
      if (!result) {
        this.emojiError = "Invalid Emoji!";
      } else {
        this.emojiError = null;
      }
    },
  },
};
</script>
