<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="p-8 bg-red-300 min-h-screen">
    <div class="flex justify-between items-center">
        <h1 class="text-3xl font-semibold font-serif">pursuit</h1>
        <a href="/applications" class="font-medium bg-yellow-200 px-4 py-2 border rounded transition hover:bg-yellow-300 cursor-pointer">
            Back to Applications
        </a>
    </div>

    <div class="max-w-2xl mx-auto mt-12 bg-white border p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold font-serif text-center mb-4">Update Application</h2>
        <form method="POST" action="?/updateApplication" class="flex flex-col gap-2">
            <div>
                <label for="role" class="block mb-1">Role:</label>
                <input type="text" id="role" name="role" class="border p-2 rounded w-full" value={data.application.role} required />
            </div>

            <div>
                <label for="company" class="block mb-1">Company:</label>
                <input type="text" id="company" name="company" class="border p-2 rounded w-full" value={data.application.company} required />
            </div>

            <div>
                <label for="type" class="block mb-1">Type:</label>
                <select id="type" name="type" class="border p-2 rounded w-full" value={data.application.type} required>
                    <option value="FULLTIME">Full-Time</option>
                    <option value="PARTTIME">Part-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                </select>
            </div>

            <div>
                <label for="location" class="block mb-1">Location:</label>
                <input type="text" id="location" name="location" class="border p-2 rounded w-full" value={data.application.location} required />
            </div>

            <div>
                <label for="status" class="block mb-1">Status:</label>
                <select id="status" name="status" class="border p-2 rounded w-full" value={data.application.status} required>
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEWING">Interviewing</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="GHOSTED">Ghosted</option>
                </select>
            </div>

            <div>
                <label for="model" class="block mb-1">Work Model:</label>
                <select id="model" name="model" class="border p-2 rounded w-full" value={data.application.model} required>
                    <option value="ONSITE">Onsite</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                </select>
            </div>

            <div>
                <label for="notes" class="block mb-1">Notes:</label>
                <textarea id="notes" name="notes" class="border p-2 rounded w-full" rows="4">{data.application.notes}</textarea>
            </div>

            <button type="submit" class="mt-2 bg-blue-200 border px-4 py-2 rounded hover:bg-blue-300 transition">
                Update
            </button>
        </form>
    </div>
</div>