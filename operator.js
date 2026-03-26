import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://ounyjjhwbqttjrtsmtjw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91bnlqamh3YnF0dGpydHNtdGp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzE1MzYsImV4cCI6MjA4OTkwNzUzNn0.0wgVlGfJEbDpjyH_eZKJt5OCgyB99WzgO-XGC4BGyl4'
)

const tableName = 'ComplainDataOperator'

let allData = [] // 🔥 simpan semua data

// 🚀 LOAD SEMUA DATA SAAT PAGE DIBUKAs
async function loadData() {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .order('DateRevision', { ascending: false })

  if (error) {
    console.log(error)
    alert('Error load data ❌')
    return
  }

  allData = data
  renderTable(allData) // tampil semua dulu
}

// 🔍 SEARCH (FILTER FRONTEND)
window.searchData = () => {
  const sn = document.getElementById('inputSN').value.trim()

  // kalau kosong → tampil semua lagi
  if (!sn) {
    renderTable(allData)
    return
  }

  // filter fleksibel (string biar aman)
  const filtered = allData.filter(item =>
    String(item.SN).includes(sn)
  )

  renderTable(filtered)
}

// 📋 RENDER TABLE
function renderTable(data) {
  const table = document.getElementById('tableBody')
  table.innerHTML = ''

  renderCards(data) // 🔥 TAMBAH INI

  if (data.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="12" class="text-center p-4 text-gray-500">
          Data tidak ditemukan
        </td>
      </tr>
    `
    return
  }

  data.forEach(item => {
    const statusColor =
      item.Status === 'Approved' ? 'bg-green-500' :
      item.Status === 'Rejected' ? 'bg-red-500' :
      'bg-yellow-400'

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
          <span class="text-white px-2 py-1 rounded ${statusColor}">
            ${item.Status || 'Pending'}
          </span>
        </td>

        <td class="p-2 text-xs">${item.Feedback || '-'}</td>
      </tr>
    `
  })
}

function renderCards(data) {
  const container = document.getElementById('cardContainer')
  container.innerHTML = ''

  if (data.length === 0) {
    container.innerHTML = `
      <div class="text-center text-gray-500 p-4">
        Data tidak ditemukan
      </div>
    `
    return
  }

  data.forEach(item => {
    const statusColor =
      item.Status === 'Approved' ? 'bg-green-500' :
      item.Status === 'Rejected' ? 'bg-red-500' :
      'bg-yellow-400'

    container.innerHTML += `
      <div class="bg-white p-4 rounded-xl shadow text-sm sm:text-base">

        <!-- HEADER -->
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="font-semibold text-sm sm:text-base">
              ${item.SN} - ${item.Name}
            </div>
            <div class="text-xs text-gray-500">
              ${item.DateRevision || '-'} | Shift ${item.ShiftID || '-'}
            </div>
          </div>

          <span class="text-white text-xs px-2 py-1 rounded ${statusColor}">
            ${item.Status || 'Pending'}
          </span>
        </div>

        <!-- DETAIL GRID -->
        <div class="grid grid-cols-2 gap-2 text-xs sm:text-sm mt-2">
          <div><b>Unit:</b> ${item.UnitID || '-'}</div>
          <div><b>Revision:</b> ${item.RevisionType || '-'}</div>
          <div><b>Ritase:</b> ${item.RitationAct || '-'}</div>
          <div><b>Distance:</b> ${item.DistanceAct || '-'}</div>
          <div class="col-span-2">
            <b>SMU:</b> ${item.SMUStart || '-'} - ${item.SMUEnd || '-'}
          </div>
        </div>

        <!-- FEEDBACK -->
        <div class="mt-3 text-xs sm:text-sm bg-gray-50 p-2 rounded">
          <b>Feedback:</b><br>
          ${item.Feedback || '-'}
        </div>

      </div>
    `
  })
}

// 🔥 SEARCH REALTIME (LANGSUNG FILTER SAAT NGETIK)
document.getElementById('inputSN').addEventListener('input', () => {
  searchData()
})

// 🔥 ENTER KEY (optional)
document.getElementById('inputSN').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchData()
  }
})

// INIT
loadData()