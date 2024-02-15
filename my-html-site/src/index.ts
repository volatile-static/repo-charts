import { Octokit } from "octokit";
import Highcharts from "highcharts";

const storageKey = "zotero-plugins-dashboard-github-token",
  auth = localStorage.getItem(storageKey),
  octokit = new Octokit({ auth }),
  chartOptions: Highcharts.Options = {
    chart: { type: "spline", zooming: { type: "x" } },
    title: { text: "Downloads StreamGraph" },
    xAxis: {
      type: "datetime",
      reversed: true,
      dateTimeLabelFormats: {
        month: "%b %Y",
        year: "%Y",
      },
    },
    series: [],
  };

onload = async function () {
  const params = new URLSearchParams(new URL(location.href).search);
  if (!params.has("repo")) return;

  try {
    const [owner, repo] = params.get("repo")!.split("/"),
      info = await octokit.rest.repos.get({ owner, repo }),
      chart = Highcharts.chart(
        "container",
        Highcharts.merge(chartOptions, {
          subtitle: {
            text: `<a href="https://github.com/${owner}/${repo}">${owner}/${repo}</a>`,
          },
          series: [
            { name: "Downloads", data: [[new Date(info.data.created_at), 0]] },
          ],
        } as Highcharts.Options)
      );
    chart.showLoading();

    const iterator = octokit.paginate.iterator(
      octokit.rest.repos.listReleases,
      {
        owner,
        repo,
        headers: { accept: "application/vnd.github+json" },
      }
    );
    for await (const { data } of iterator)
      for (const release of data) {
        const asset = release.assets[0],
          published = release.published_at ?? release.created_at,
          date = new Date(published),
          downloaded = asset?.download_count ?? 0;
        chart.series[0].addPoint([date, downloaded]);
      }
    console.debug(chart.getOptions());
    chart.hideLoading();
  } catch (error) {
    if (error instanceof Error) alert(error.message);
    else console.error(error);
  }
};
