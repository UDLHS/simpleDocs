const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'evaluation/results/live_eval_dataset_live_export_20260409_095016.jsonl');
const data = fs.readFileSync(file, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l));

const stats = { total: data.length, success: 0, partial: 0, fail: 0, latency_sum: 0, count_latency: 0, by_env: {} };

for(const d of data) {
    if(d.status === 'success') stats.success++;
    else if(d.status === 'partial') stats.partial++;
    else stats.fail++;

    if(d.latency_ms && d.status === 'success') {
        stats.latency_sum += d.latency_ms;
        stats.count_latency++;
    }

    const env = d.environment_type || 'unknown';
    if(!stats.by_env[env]) stats.by_env[env] = { count: 0, latency_sum: 0, latency_count: 0, success: 0, selected_chars: 0, bg_chars: 0 };
    stats.by_env[env].count++;
    if(d.status === 'success') {
        stats.by_env[env].success++;
        stats.by_env[env].selected_chars += (d.selected_chars || 0);
        stats.by_env[env].bg_chars += (d.background_chars || 0);
    }
    if(d.latency_ms && d.status === 'success') {
        stats.by_env[env].latency_sum += d.latency_ms;
        stats.by_env[env].latency_count++;
    }
}

console.log(`Overall Average Latency (ms): ${stats.count_latency ? (stats.latency_sum / stats.count_latency).toFixed(0) : 0}ms`);
console.log(`Total Requests Analyzed: ${stats.total}`);
console.log(`Status Breakdown:\n- Success: ${(stats.success/stats.total*100).toFixed(1)}%\n- Partial: ${(stats.partial/stats.total*100).toFixed(1)}%\n- Failed: ${(stats.fail/stats.total*100).toFixed(1)}%\n`);
console.log("Performance By Environment Type:");
console.log("| Environment | Success Rate | Avg Capture Latency | Avg Selected Text | Avg Background |");
console.log("|---|---|---|---|---|");
for(const env in stats.by_env) {
    const e = stats.by_env[env];
    if (e.success === 0) continue; // skip 100% fail 
    const avgLatency = e.latency_count ? (e.latency_sum / e.latency_count).toFixed(0) : 0;
    const rate = (e.success / e.count * 100).toFixed(1);
    const avgSelected = e.success ? (e.selected_chars / e.success).toFixed(0) : 0;
    const avgBg = e.success ? (e.bg_chars / e.success).toFixed(0) : 0;
    console.log(`| ${env} | ${rate}% | ${avgLatency}ms | ${avgSelected} chars | ${avgBg} chars |`);
}
