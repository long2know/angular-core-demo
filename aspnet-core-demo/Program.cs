using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace aspnet_core_demo
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
            string launch = Environment.GetEnvironmentVariable("LAUNCH_PROFILE");

            var appSettings = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env}.json", optional: false, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();

            IWebHostBuilder hostBuilder = null;

            if (string.Equals(env, "Development", StringComparison.OrdinalIgnoreCase) &&
                string.Equals(launch, "Kestrel", StringComparison.OrdinalIgnoreCase) &&
                File.Exists($"{Directory.GetCurrentDirectory()}/{@"Properties/hosting.json"}"))
            {
                var config = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile(@"Properties/hosting.json", optional: false, reloadOnChange: true)
                    .Build();

                var regEx = new Regex(@"((http[s]?):\/\/)([\w\d\.]*)(?:\:\d+)");
                var rootUrl = regEx.Match(config["urls"]).Value;
                var rootUrlPort = new Uri(rootUrl).Port;

                hostBuilder = new WebHostBuilder()
                    .UseConfiguration(config)
                    .UseKestrel()
                    //.UseKestrel(options => options.Listen(IPAddress.Loopback, rootUrlPort, listenOptions =>
                    //{
                    //    listenOptions.UseHttps(new X509Certificate2("testCert.pfx", "testPassword"));
                    //}))
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseStartup<Startup>()
                    .UseIISIntegration();

                // This may or nmay not be necessary
                OpenBrowser(rootUrl);
            }
            else
            {
                hostBuilder = new WebHostBuilder()
                    .UseKestrel()
                    .UseContentRoot(Directory.GetCurrentDirectory())
                    .UseStartup<Startup>()
                    .UseIISIntegration();
            }

            // Add console and debug logging to the host builder
            hostBuilder
                .ConfigureLogging(logging =>
                {
                    //logging.AddConfiguration(appSettings.GetSection("Logging"));
                    logging.AddConsole();
                    logging.AddDebug();
                })
                .Build()
                .Run();
        }

        public static void OpenBrowser(string url)
        {
            try
            {
                Process.Start(url);
            }
            catch
            {
                // hack because of this: https://github.com/dotnet/corefx/issues/10361
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                {
                    url = url.Replace("&", "^&");
                    Process.Start(new ProcessStartInfo("cmd", $"/c start {url}") { CreateNoWindow = true });
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                {
                    Process.Start("xdg-open", url);
                }
                else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
                {
                    Process.Start("open", url);
                }
                else
                {
                    throw;
                }
            }
        }

        // Original method from template
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
