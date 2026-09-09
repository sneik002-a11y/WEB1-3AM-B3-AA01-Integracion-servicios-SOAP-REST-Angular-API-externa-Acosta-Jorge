using TiendaSOAP.Data;
using TiendaSOAP.Services;
using CoreWCF;
using CoreWCF.Configuration;
using CoreWCF.Description;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<TiendaDBContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("TiendaConnection")
    )
);

builder.Services.AddScoped<ProductoService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services
    .AddServiceModelServices()
    .AddServiceModelMetadata();

builder.Services.AddSingleton<IServiceBehavior,
    UseRequestHeadersForMetadataAddressBehavior>();

builder.WebHost.ConfigureKestrel(options =>
{
    options.AllowSynchronousIO = true;
});

var app = builder.Build();

app.UseCors("AngularPolicy");

app.UseServiceModel(serviceBuilder =>
{
    serviceBuilder
        .AddService<ProductoService>()
        .AddServiceEndpoint<ProductoService, IProductoService>(
            new BasicHttpBinding(),
            "/ProductoService.svc"
        );
});

var metadataBehavior =
    app.Services.GetRequiredService<ServiceMetadataBehavior>();

metadataBehavior.HttpGetEnabled = true;

app.Run(); 