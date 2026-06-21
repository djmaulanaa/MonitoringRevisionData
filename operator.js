import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://ounyjjhwbqttjrtsmtjw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bnlqamh3YnF0dGpydHNtdGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE1MzYsImV4cCI6MjA4OTkwNzUzNn0.0wgVlGfJEbDpjyH_eZKJt5OCgyB99WzgO-XGC4BGyl4'
)

const tableName = 'ComplainDataOperator'

// SEARCH KE DATABASE
window.searchData = async () => {

  const sn = document
    .getElementById('inputSN')
    .value
    .trim()

  if (!sn) {
    alert('Please enter Service Number')
    return
  }

  document
    .getElementById('loading')
    .classList.remove('hidden')

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('SN', sn)
    .order('DateRevision', { ascending: false })
    .limit(100)

  document
    .getElementById('loading')
    .classList.add('hidden')

  if (error) {
    console.log(error)
    alert('Failed to load data')
    return
  }

  renderTable(data)
}

// RENDER TABLE
function renderTable(data) {

  const table = document.getElementById('tableBody')
  table.innerHTML = ''

  renderCards(data)

  if (!data || data.length === 0) {

    table.innerHTML = `
      <tr>
        <td colspan="12"
            class="text-center p-6 text-gray-500">
          No data found
        </td>
      </tr>
    `

    return
  }

  data.forEach(item => {

    const statusColor =
      item.Status === 'Approved'
        ? 'bg-green-500'
        : item.Status === 'Rejected'
        ? 'bg-red-500'
        : 'bg-yellow-500'

    table.innerHTML += `
      <tr class="border-b hover:bg-gray-50">

        <td class="p-2">${item.DateRevision || '-'}</td>
        <td class="p-2">${item.ShiftID || '-'}</td>
        <td class="p-2">${item.SN || '-'}</td>
        <td class="p-2">${item.Name || '-'}</td>
        <td class="p-2">${item.UnitID || '-'}</td>
        <td class="p-2">${item.RevisionType || '-'}</td>
        <td class="p-2">${item.RitationAct || '-'}</td>
        <td class="p-2">${item.DistanceAct || '-'}</td>
        <td class="p-2">${item.SMUStart || '-'}</td>
        <td class="p-2">${item.SMUEnd || '-'}</td>

        <td class="p-2">
          <span class="text-white px-3 py-1 rounded-full text-xs ${statusColor}">
            ${item.Status || 'Pending'}
          </span>
        </td>

        <td class="p-2 text-xs">
          ${item.Feedback || '-'}
        </td>

      </tr>
    `
  })
}

// MOBILE CARD
function renderCards(data) {

  const container =
    document.getElementById('cardContainer')

  container.innerHTML = ''

  if (!data || data.length === 0) {

    container.innerHTML = `
      <div class="bg-white rounded-xl p-4 text-center text-gray-500">
        No data found
      </div>
    `

    return
  }

  data.forEach(item => {

    const statusColor =
      item.Status === 'Approved'
        ? 'bg-green-500'
        : item.Status === 'Rejected'
        ? 'bg-red-500'
        : 'bg-yellow-500'

    container.innerHTML += `
      <div class="bg-white/95 rounded-2xl shadow-lg p-4">

        <div class="flex justify-between mb-3">

          <div>
            <div class="font-semibold">
              ${item.SN} - ${item.Name}
            </div>

            <div class="text-xs text-gray-500">
              ${item.DateRevision || '-'}
            </div>
          </div>

          <span class="text-white text-xs px-2 py-1 rounded ${statusColor}">
            ${item.Status || 'Pending'}
          </span>

        </div>

        <div class="grid grid-cols-2 gap-2 text-sm">

          <div>
            <b>Unit</b><br>
            ${item.UnitID || '-'}
          </div>

          <div>
            <b>Revision</b><br>
            ${item.RevisionType || '-'}
          </div>

          <div>
            <b>Ritase</b><br>
            ${item.RitationAct || '-'}
          </div>

          <div>
            <b>Distance</b><br>
            ${item.DistanceAct || '-'}
          </div>

        </div>

        <div class="mt-3 bg-gray-50 p-2 rounded text-sm">
          <b>Feedback</b><br>
          ${item.Feedback || '-'}
        </div>

      </div>
    `
  })
}

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', function (e) {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});

// ENTER KEY
document
  .getElementById('inputSN')
  .addEventListener('keypress', function (e) {

    if (e.key === 'Enter') {
      searchData()
    }

  })

// TAMPILAN AWAL KOSONG
renderTable([])

