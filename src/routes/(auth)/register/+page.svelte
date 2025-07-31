<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex items-center justify-center min-h-screen bg-red-300 p-4">
	<div class="w-full max-w-md p-8 space-y-6 bg-white border rounded-lg shadow-lg">
		<h1 class="text-3xl font-bold font-serif text-center text-gray-900">Create Account</h1>

		<form method="POST" action="?/register" use:enhance class="space-y-6">
			<div>
				<label for="username" class="block mb-2 font-medium text-gray-700">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="w-full p-2 bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 font-medium text-gray-700">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full p-2 bg-gray-50 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
				/>
			</div>

			{#if form?.message}
				<p class="text-sm text-red-600 text-center">{form.message}</p>
			{/if}

			<button
				type="submit"
				class="w-full font-medium bg-blue-200 px-4 py-2 border rounded transition hover:bg-blue-300 cursor-pointer"
			>
				Create Account
			</button>
		</form>

		<p class="text-sm text-center">
			Already have an account?
			<a href="/login" class="font-medium hover:underline">Sign in</a>
		</p>
	</div>
</div>
