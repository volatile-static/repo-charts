import { Octokit } from "octokit";
import { h } from "preact";
import render from "preact-render-to-string";
import Highcharts from "highcharts";
import HighchartsVariwide from "highcharts/modules/variwide";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsExportData from "highcharts/modules/export-data";
HighchartsVariwide(Highcharts);
HighchartsExporting(Highcharts);
HighchartsExportData(Highcharts);

interface Point extends Highcharts.Point {
  custom: {
    begin: number;
    end: number;
    title: string;
  };
  z: number;
}

const storageKey = "zotero-plugins-dashboard-github-token",
  auth = localStorage.getItem(storageKey),
  octokit = new Octokit({ auth }),
  chartOptions: Highcharts.Options = {
    chart: { type: "variwide", zooming: { type: "x" } },
    title: { text: "Downloads ColumnGraph" },
    xAxis: { type: "category", reversed: true },
    legend: { enabled: false },
    yAxis: {
      type: "logarithmic",
      title: { text: "Downloads / Dates" },
    },
    series: [
      {
        type: "variwide",
        name: "Downloads",
        minPointLength: 8,
        colorByPoint: true,
      },
    ],
    tooltip: {
      useHTML: true,
      formatter() {
        const point = this.point as Point,
          downloads = Math.round(point.y! * point.z ** 2);
        return render(
          <table>
            <thead>
              <tr>
                <td colSpan={2}>
                  <b>{point.custom.title}</b>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: point.color as string }}>Downloads:</td>
                <td>
                  {downloads > 1000
                    ? `${Math.round(downloads / 1000)}k`
                    : downloads}
                </td>
              </tr>
              <tr>
                <td style={{ color: point.color as string }}>Begin:</td>
                <td>{new Date(point.custom.begin).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style={{ color: point.color as string }}>End:</td>
                <td>{new Date(point.custom.end).toLocaleDateString()}</td>
              </tr>
            </tbody>
          </table>
        );
      },
    },
  };

onload = async function () {
  const params = new URLSearchParams(new URL(location.href).search);
  if (!params.has("repo")) return;

  const [owner, repo] = params.get("repo")!.split("/"),
    chart = Highcharts.chart(
      "container",
      Highcharts.merge(chartOptions, {
        subtitle: {
          text: render(
            <a href={`https://github.com/${owner}/${repo}`}>{owner}/{repo}</a>
          ),
        },
      } as Highcharts.Options)
    );
  chart.showLoading();

  try {
    const iterator = octokit.paginate.iterator(
      octokit.rest.repos.listReleases,
      {
        owner,
        repo,
        headers: { accept: "application/vnd.github+json" },
      }
    );
    let point: [string, number, number] = ["", 0, 0];
    for await (const { data } of iterator)
      for (const release of data) {
        const asset = release.assets[0],
          published = release.published_at ?? release.created_at,
          date = new Date(published),
          downloaded = asset?.download_count ?? 0;
        if (point.some(Boolean))
          chart.series[0].addPoint({
            name: point[0],
            y: point[1] / (point[2] - date.getTime()),
            z: Math.sqrt(point[2] - date.getTime()),
            custom: {
              begin: date.getTime(),
              end: point[2],
              title: release.name,
            },
          } as Point);
        point = [release.tag_name, downloaded, date.getTime()];
      }
  } catch (error) {
    if (error instanceof Error) alert(error.message);
    else console.error(error);
  } finally {
    chart.hideLoading();
  }
};
