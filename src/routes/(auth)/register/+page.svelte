<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-50">
	<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
		<h1 class="text-2xl font-bold text-center text-gray-900">Create an Account</h1>
		<form method="POST" action="?/register" use:enhance class="space-y-6">
			<div>
				<label for="username" class="block mb-2 text-sm font-medium text-gray-700">Username</label>
				<input
					id="username"
					name="username"
					type="text"
					required
					class="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium text-gray-700">Password</label>
				<input
					id="password"
					name="password"
					type="password"
					required
					class="w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			{#if form?.message}
				<p class="text-sm text-red-500">{form.message}</p>
			{/if}

			<button
				type="submit"
				class="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
			>
				Register
			</button>
		</form>
		<p class="text-sm text-center text-gray-500">
			Already have an account?
			<a href="/login" class="font-medium text-blue-600 hover:underline">Sign in</a>
		</p>
	</div>
</div>