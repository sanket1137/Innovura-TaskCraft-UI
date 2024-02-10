#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Innovura_TaskCraft_UI/Innovura_TaskCraft_UI.csproj", "Innovura_TaskCraft_UI/"]
RUN dotnet restore "Innovura_TaskCraft_UI/Innovura_TaskCraft_UI.csproj"
COPY . .
WORKDIR "/src/Innovura_TaskCraft_UI"
RUN dotnet build "Innovura_TaskCraft_UI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Innovura_TaskCraft_UI.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Innovura_TaskCraft_UI.dll"]